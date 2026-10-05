'use strict';
// Browser transport and composition only. Every painted pixel, including the
// progress track, digits and retry button, comes from boot-atlas.json/UI Maker.
(() => {
 const config=window.TOWN_BOOT, canvas=document.getElementById('controls'),ctx=canvas.getContext('2d');
 const started=performance.now(), image=new Image(), phases=['download','runtime','models','graphics','first-frame','error','cache'];
 const boot=window.townBoot={phase:'download',done:false,failed:false,progress:null,cache:'pending',history:[],timings:{}};
 let atlasReady=false,rect=null,downloadStarted=0,initStarted=0;
 const elapsed=()=>performance.now()-started;
 function stage(phase,done=0,total=0){
  if(boot.failed||boot.done)return;
  if(boot.phase!==phase||!boot.history.length)boot.history.push({phase,at_ms:elapsed()});
  boot.phase=phase;boot.progress=total>0?Math.min(1,Math.max(0,done/total)):null;boot.completed=done;boot.total=total;
 }
 boot.stage=stage;
 boot.fail=message=>{if(boot.done)return;boot.failed=true;boot.phase='error';boot.error=String(message);boot.progress=null;draw();};
 boot.runtime=()=>{boot.timings.runtime_ready_ms=elapsed();stage('runtime');};
 boot.complete=()=>{
  if(boot.failed||boot.done)return;
  boot.done=true;boot.phase='ready';boot.timings.first_frame_ms=elapsed();
  boot.timings.initialization_ms=performance.now()-initStarted;
  boot.history.push({phase:'ready',at_ms:elapsed()});canvas.style.cursor='';
  console.info('TOWN STARTUP',JSON.stringify({cache:boot.cache,timings:boot.timings}));
 };
 function draw(){
  if(boot.done||!atlasReady)return;
  const density=canvas.width/innerWidth,scale=Math.min(1,(innerWidth-24)/448,(innerHeight-24)/280);
  const x=(innerWidth-448*scale)/2,y=(innerHeight-280*scale)/2;rect={x,y,scale};
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(density,density);ctx.translate(x,y);ctx.scale(scale,scale);
  const sprite=(sx,sy,w,h,dx,dy,dw=w,dh=h)=>ctx.drawImage(image,sx*2,sy*2,w*2,h*2,dx,dy,dw,dh);
  sprite(0,0,448,280,0,0);
  sprite(0,280+32*phases.indexOf(boot.phase),448,32,0,115);
  if(boot.failed){sprite(0,510,448,32,0,151);sprite(0,552,208,48,120,183);canvas.style.cursor='pointer';}
  else {
   sprite(8,626,400,14,24,159);
   if(boot.progress!==null){
    const width=400*boot.progress;if(width>0)sprite(8,658,width,14,24,159);
    const digits=Math.floor(boot.progress*100)+'%';let dx=(448-digits.length*20)/2;
    for(const digit of digits){sprite((digit==='%'?10:Number(digit))*28,706,28,36,dx,181,20,26);dx+=20;}
   }
  }
  ctx.restore();
 }
 function tick(){draw();if(!boot.done)requestAnimationFrame(tick);}
 canvas.addEventListener('pointerdown',event=>{
  if(boot.done)return;event.stopImmediatePropagation();event.preventDefault();
  if(boot.failed&&rect){const x=(event.clientX-rect.x)/rect.scale,y=(event.clientY-rect.y)/rect.scale;if(x>=120&&x<=328&&y>=183&&y<=231)location.reload();}
 },true);
 canvas.addEventListener('wheel',event=>{if(!boot.done){event.stopImmediatePropagation();event.preventDefault();}},{capture:true,passive:false});
 window.addEventListener('keydown',event=>{if(boot.failed&&(event.key==='Enter'||event.key===' ')){event.preventDefault();location.reload();}});
 if(!config){boot.fail('Bootstrap configuration unavailable');return;}
 image.onload=()=>{atlasReady=true;requestAnimationFrame(tick);start().catch(townFailure);};
 image.onerror=()=>townFailure('Bootstrap image unavailable');image.src=config.atlas;

 async function hash(bytes){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');}
 async function read(response,report){
  if(!response.ok)throw new Error('Town download returned HTTP '+response.status);
  const data=new Uint8Array(config.data.bytes);let received=0;
  if(!response.body)throw new Error('Streaming download is unavailable');
  const reader=response.body.getReader();
  try{
   for(;;){const {done,value}=await reader.read();if(done)break;
    if(received+value.length>data.length)throw new Error('Town download exceeds its release manifest');
    data.set(value,received);received+=value.length;report(received,data.length);
   }
  }catch(error){await reader.cancel().catch(()=>{});throw error;}finally{reader.releaseLock();}
  if(received!==data.length||await hash(data)!==config.data.sha256)throw new Error('Town download failed its release check');
  return data;
 }
 async function start(){
  // One verified package, at most 96 MiB in this app's cache. Cache failures
  // fall back to normal HTTP; no service worker, save access or origin cleanup.
  if(!Number.isSafeInteger(config.data.bytes)||config.data.bytes<1||config.data.bytes>96*1024*1024)throw new Error('Invalid town package budget');
  const cacheName='abyss-town-package-v1',key=new URL('__town_cache__/'+config.wasm_sha256+'-'+config.data.sha256,location.href).href;
  let cache=null,bytes=null;downloadStarted=performance.now();
  try{
   cache=await caches.open(cacheName);const saved=await cache.match(key);
   if(saved){stage('cache');try{bytes=await read(saved,(n,total)=>stage('cache',n,total));boot.cache='hit';}catch(error){await cache.delete(key);boot.cache='corrupt';}}
  }catch(error){boot.cache='unavailable';}
  if(!bytes){
   stage('download');if(boot.cache==='pending')boot.cache='miss';
   const controller=new AbortController();let timeout;
   const watchdog=()=>{clearTimeout(timeout);timeout=setTimeout(()=>controller.abort(),45000);};watchdog();
   try{bytes=await read(await fetch('town.data',{signal:controller.signal}),(n,total)=>{watchdog();stage('download',n,total);});}
   finally{clearTimeout(timeout);}
  }
  boot.timings.package_ready_ms=elapsed();boot.timings.package_ms=performance.now()-downloadStarted;
  stage('runtime');initStarted=performance.now();
  // Give the runtime exactly the verified data. getPreloadedPackage is
  // synchronous; fetching here prevents a second Emscripten network request.
  let preload=bytes.buffer;Module.getPreloadedPackage=()=>{const buffer=preload;preload=null;Module.getPreloadedPackage=null;return buffer;};
  const script=document.createElement('script');script.src='town.js';script.onerror=()=>townFailure('Could not load the town runtime');document.body.appendChild(script);
  if(cache&&boot.cache!=='hit'){
   try{
    for(const old of await cache.keys())if(old.url!==key)await cache.delete(old);
    await cache.put(key,new Response(bytes,{headers:{'Content-Type':'application/octet-stream'}}));boot.cache_write='saved';
   }catch(error){boot.cache_write='unavailable';boot.cache_error=String(error);}
  }
  bytes=null;
 }
})();
