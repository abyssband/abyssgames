'use strict';
const $ = id => document.getElementById(id);
const samples = {interval: [], cpu: [], update: [], gpu: [], invalid: 0, skipped: 0};
let previous = 0, reportAt = 0, ext = null, pending = [], active = null, timerContext = null, epoch = 0;
let runtimeReady = false, rendererName = '', contextLost = false;
const bounded = (a, v) => {a.push(v); if (a.length > 600) a.shift();};
const percentile = (a, f) => a.length ? [...a].sort((a,b) => a-b)[Math.min(a.length-1,Math.floor(a.length*f))] : null;
function townFailure(message) {window.townError=String(message);document.title='Abyss Town / '+message;console.error(message);if(window.townBoot&&!townBoot.done)townBoot.fail(message);else if(runtimeReady)call('town_notice',null,['string'],[String(message)]);}
function resetStats() {
  epoch++; previous = 0; for (const k of ['interval','cpu','update','gpu']) samples[k].length = 0;
  samples.invalid = samples.skipped = 0;
}
function townGpuBegin(gl) {
  if (timerContext !== gl) {
    timerContext = gl; ext = gl.getExtension('EXT_disjoint_timer_query_webgl2'); pending = [];
    const debug = gl.getExtension('WEBGL_debug_renderer_info');
    rendererName = debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  }
  if (!ext) return;
  if (gl.getParameter(ext.GPU_DISJOINT_EXT)) {
    samples.invalid += pending.length; samples.gpu.length = 0;
    for (const q of pending) gl.deleteQuery(q.query); pending = [];
  }
  while (pending.length && gl.getQueryParameter(pending[0].query, gl.QUERY_RESULT_AVAILABLE)) {
    const q = pending.shift(), ns = gl.getQueryParameter(q.query, gl.QUERY_RESULT); gl.deleteQuery(q.query);
    if (q.epoch === epoch && Number.isFinite(ns) && ns > 0) bounded(samples.gpu, ns / 1e6);
  }
  if (pending.length >= 6) {samples.skipped++; return;}
  active = {query: gl.createQuery(), epoch}; gl.beginQuery(ext.TIME_ELAPSED_EXT, active.query);
}
function townGpuEnd(gl) {if (active) {gl.endQuery(ext.TIME_ELAPSED_EXT); pending.push(active); active = null;}}
function townContext(lost) {
  contextLost = Boolean(lost); timerContext = null; ext = null; pending = []; active = null; resetStats();
  if (lost) townFailure('Graphics context lost. Waiting for the browser to restore it…');
  else {window.townError='';document.title='Abyss Town / WebGL 2';}
}
function state() {return JSON.parse(Module.ccall('town_state','string',[],[]));}
function call(name, result, types, args) {return Module.ccall(name,result,types,args);}
function stats() {
  const summary = {};
  for (const k of ['interval','cpu','update','gpu']) summary[k] = {count:samples[k].length,p50:percentile(samples[k],.5),p95:percentile(samples[k],.95),max:samples[k].length?Math.max(...samples[k]):null};
  return {state:state(),summary,samples:structuredClone(samples),visibility:document.visibilityState,gpu_timer:!!ext,renderer:rendererName,wasm_bytes:Module.HEAPU8.length,width:$('canvas').width,height:$('canvas').height,dpr:Math.min(devicePixelRatio,2),user_agent:navigator.userAgent};
}
function view(changes) {
  const s=state(), v={yaw:s.yaw,elevation:s.elevation,zoom:s.zoom,x:s.focus_x,y:s.focus_y,hours:s.hours,paused:s.paused,orbit:s.orbit,...changes};
  const ok=call('town_view','number',Array(8).fill('number'),[v.yaw,v.elevation,v.zoom,v.x,v.y,v.hours,+v.paused,+v.orbit]); if(ok) resetStats(); return !!ok;
}
function refresh(s) {
  if(!s.ready && !s.context_lost) {townFailure(s.error || 'Renderer stopped.'); return;}
  call('town_hud',null,['number','number','number','number'],[percentile(samples.interval,.5)||0,percentile(samples.cpu,.5)||0,percentile(samples.gpu,.5)||0,+!!ext]);
}
function townFrame(cpu,update) {
  if(window.townBoot&&!townBoot.done){const s=state();if(!s.ready){townFailure(s.error||'First frame failed');return;}townBoot.complete();resize();window.abyssTownState=s;resize();document.title='Abyss Town / WebGL 2';}
  const now=performance.now(); if(previous) bounded(samples.interval,now-previous); previous=now; bounded(samples.cpu,cpu);bounded(samples.update,update);
  if(now-reportAt>400){reportAt=now;const s=state();window.abyssTownState=s;refresh(s);}
}
/* One accepted viewport snapshot. Recipes see logical Y-down points; pointers
 * enter as CSS points; EngineUI alone applies raster density. */
function townViewportFit(width,height,density,gameplay,safeBottom) {
 if(![width,height,density,safeBottom].every(Number.isFinite)||width<=0||height<=0||density<=0||safeBottom<0)return null;
 const scale=gameplay?Math.min(width/(width<600?450:900),height/710):Math.min(1,width/448,height/720);
 return Object.freeze({css_width:width,css_height:height,density:Math.max(1,Math.min(density,2)),scale,
  width:Math.max(448,Math.round(width/scale)),height:Math.max(gameplay?1:720,Math.round(height/scale)),
  safe_bottom:Math.ceil(Math.min(safeBottom,height)/scale)});
}
function townViewportPoint(clientX,clientY,rect) {
 const v=window.townViewport;if(!v||rect.width<=0||rect.height<=0)return null;
 const x=clientX-rect.left,y=clientY-rect.top;
 return {ui_x:x/v.scale,ui_y:y/v.scale,scene_x:x/rect.width,scene_y:y/rect.height};
}
function resize() {
 const dpr=Math.max(1,Math.min(devicePixelRatio,2)),c=$('canvas'),u=$('controls');
 c.width=Math.min(4096,Math.round(innerWidth*dpr));c.height=Math.min(4096,Math.round(innerHeight*dpr));u.width=c.width;u.height=c.height;
 const gameplay=runtimeReady&&window.abyssTownState?.game;
 const v=townViewportFit(innerWidth,innerHeight,dpr,gameplay,parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-bottom'))||0);
 if(!v)return;
 if(runtimeReady&&!call('town_layout','number',['number','number','number'],[v.width,v.height,v.density])){townFailure('Viewport layout rejected');return;}
 window.townViewport=v;window.townUiScale=v.scale;resetStats();
}
window.addEventListener('resize',resize);resize();
document.addEventListener('visibilitychange',()=>{previous=0;if(runtimeReady)call('town_suspend',null,[],[]);});
var Module = window.Module = {
 canvas:$('canvas'),
 setStatus(message){if(message)document.title='Abyss Town / '+message;},
 onAbort:townFailure, printErr:message=>console.error(message),
 onRuntimeInitialized(){runtimeReady=true;window.townBoot?.runtime();}

};
window.town = {
 state,stats,resetStats,view,
 viewport(){return window.townViewport;},
 point(x,y){return townViewportPoint(x,y,$('controls').getBoundingClientRect());},
 event(name){const ok=call('town_event','number',['string'],[name]);if(ok)resetStats();return !!ok;},
 setting(name,value){const ok=call('town_setting','number',['string','number'],[name,value]);if(ok)resetStats();return !!ok;},
 contextLoss(){const gl=$('canvas').getContext('webgl2'),loss=gl?.getExtension('WEBGL_lose_context');if(!loss)return false;loss.loseContext();setTimeout(()=>loss.restoreContext(),500);return true;}
};
function panelPointer(phase,e){const p=town.point(e.clientX,e.clientY);return p?call('town_pointer','number',['number','number','number'],[phase,p.ui_x,p.ui_y]):0;}
let drag=null;
$('controls').onpointerdown=e=>{if(!runtimeReady)return;$('controls').setPointerCapture(e.pointerId);if(panelPointer(0,e)){drag=null;return;}drag={x:e.clientX,y:e.clientY,state:state(),pan:e.shiftKey,game:!!state().game,button:e.button};};
$('controls').onpointermove=e=>{if(!drag||(drag.game&&drag.button!==2))return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y,s=drag.state;
 if(drag.pan){const units=2/(innerHeight*s.zoom),a=s.yaw*Math.PI/180;view({x:s.focus_x-(dx*Math.cos(a)+dy*Math.sin(a))*units,y:s.focus_y+(-dx*Math.sin(a)+dy*Math.cos(a))*units});}
 else view({yaw:s.yaw+dx*.25,elevation:Math.max(5,Math.min(85,s.elevation+dy*.2)),orbit:false});};
$('controls').onpointerup=e=>{if(!runtimeReady)return;if(panelPointer(1,e))resetStats();else if(drag?.game&&drag.button===0&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<5){const p=town.point(e.clientX,e.clientY);if(p)call('town_pick','number',['number','number'],[p.scene_x,p.scene_y]);}drag=null;};
$('controls').onpointercancel=e=>{if(runtimeReady)panelPointer(2,e);drag=null;};
$('controls').addEventListener('wheel',e=>{if(!runtimeReady)return;e.preventDefault();view({zoom:Math.max(.02,Math.min(1,state().zoom*Math.exp(-e.deltaY*.001)))});},{passive:false});
window.addEventListener('error',e=>townFailure(e.message));

$('controls').oncontextmenu=e=>e.preventDefault();
const gameKeys=new Set();
function gameInput(){if(!runtimeReady||!window.abyssTownState?.game)return;call('town_input',null,['number','number','number'],[+gameKeys.has('KeyW')-+gameKeys.has('KeyS'),+gameKeys.has('KeyD')-+gameKeys.has('KeyA'),+(gameKeys.has('ShiftLeft')||gameKeys.has('ShiftRight'))]);}
window.addEventListener('keydown',e=>{if(!runtimeReady||!window.abyssTownState?.game)return;const actions={Escape:'play:menu',Space:'play:jump',KeyF:'play:fall',KeyR:'play:recover'};if(actions[e.code]){e.preventDefault();if(!e.repeat)call('town_command','number',['string'],[actions[e.code]]);}else if(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();gameKeys.add(e.code);gameInput();}});
window.addEventListener('keyup',e=>{gameKeys.delete(e.code);gameInput();});
window.addEventListener('blur',()=>{gameKeys.clear();gameInput();});
