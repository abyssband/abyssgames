'use strict';
const messages={
  "en": {
    "noticeError": "Action unavailable",
    "title": "Little Days",
    "preview": "OpenWorld preview",
    "loading": "Loading your world…",
    "downloading": "Downloading assets",
    "initializing": "Preparing the character and scene…",
    "failed": "Could not load the preview",
    "retry": "Try again",
    "wait": "Still loading. The first visit downloads about 12 MB.",
    "quality": "Resolution",
    "balanced": "Balanced",
    "battery": "Power saving",
    "crisp": "Crisp",
    "canvas": "3D world. Tap furniture to interact.",
    "controls": "World controls",
    "hint": "Tap furniture to interact. Use Home / outdoors to walk to the door.",
    "report": "Report an issue",
    "paused": "Paused",
    "running": "Playing",
    "auto": "Autonomous",
    "manual": "Manual",
    "saveLocal": "Saved on this browser",
    "cpu": "update + submit",
    "tris": "tris",
    "draws": "draws",
    "heap": "WASM heap",
    "gpu": "GPU time not measured",
    "yard": "Outdoors",
    "home": "Home",
    "saveError": "Could not save. Keep this tab open.",
    "readError": "Could not read the local save",
    "contextLost": "Graphics interrupted. Reload to restore your save.",
    "saved": "Saved",
    "arrived": "Arrived",
    "walkingDoor": "Walking to the door",
    "rewindBusy": "Rewind unavailable during scene travel",
    "rewound": "Rewound {seconds}s; press Pause / resume to continue",
    "diagnostic": "Details",
    "clock": "Time",
    "buttons": {
      "0": "Pause / resume",
      "1": "Speed",
      "2": "Autonomy",
      "20": "Eat",
      "21": "Rest",
      "22": "Relax",
      "23": "Work",
      "30": "Home / outdoors",
      "4": "Cancel",
      "10": "Rewind 5s",
      "6": "Home outfit",
      "7": "Outdoor outfit",
      "5": "Save"
    }
  },
  "zh-Hant": {
    "noticeError": "目前無法完成操作",
    "title": "小日子",
    "preview": "OpenWorld 預覽",
    "loading": "正在載入你的世界…",
    "downloading": "正在下載素材",
    "initializing": "正在準備角色與場景…",
    "failed": "預覽載入失敗",
    "retry": "重新載入",
    "wait": "仍在載入中，首次約需下載 12 MB。",
    "quality": "畫面解析度",
    "balanced": "均衡畫質",
    "battery": "省電",
    "crisp": "清晰",
    "canvas": "3D 世界，點選家具互動",
    "controls": "世界控制",
    "hint": "點選家具互動；室內／戶外按鈕會走向門口",
    "report": "回報問題",
    "paused": "已暫停",
    "running": "進行中",
    "auto": "自主",
    "manual": "手動",
    "saveLocal": "此瀏覽器獨立存檔",
    "cpu": "更新＋提交",
    "tris": "三角面",
    "draws": "繪製次數",
    "heap": "WASM 記憶體",
    "gpu": "GPU 時間未量測",
    "yard": "戶外",
    "home": "居家",
    "saveError": "瀏覽器儲存失敗，請保留分頁",
    "readError": "無法讀取本機存檔",
    "contextLost": "圖形內容已中斷，請重新載入以恢復存檔。",
    "saved": "已儲存",
    "arrived": "已抵達",
    "walkingDoor": "正在走向門口",
    "rewindBusy": "轉景途中無法倒轉",
    "rewound": "已倒轉 {seconds} 秒；按「暫停／繼續」恢復",
    "diagnostic": "詳細資訊",
    "clock": "時間",
    "buttons": {
      "0": "暫停／繼續",
      "1": "速度",
      "2": "自主生活",
      "20": "吃飯",
      "21": "休息",
      "22": "休閒",
      "23": "工作",
      "30": "室內／戶外",
      "4": "取消",
      "10": "倒轉 5 秒",
      "6": "居家服",
      "7": "戶外服",
      "5": "儲存"
    }
  },
  "zh-Hans": {
    "noticeError": "目前无法完成操作",
    "title": "小日子",
    "preview": "OpenWorld 预览",
    "loading": "正在载入你的世界…",
    "downloading": "正在下载素材",
    "initializing": "正在准备角色与场景…",
    "failed": "预览载入失败",
    "retry": "重新载入",
    "wait": "仍在载入中，首次约需下载 12 MB。",
    "quality": "画面分辨率",
    "balanced": "均衡画质",
    "battery": "省电",
    "crisp": "清晰",
    "canvas": "3D 世界，点击家具互动",
    "controls": "世界控制",
    "hint": "点击家具互动；室内／户外按钮会走向门口",
    "report": "反馈问题",
    "paused": "已暂停",
    "running": "进行中",
    "auto": "自主",
    "manual": "手动",
    "saveLocal": "此浏览器独立存档",
    "cpu": "更新＋提交",
    "tris": "三角面",
    "draws": "绘制次数",
    "heap": "WASM 内存",
    "gpu": "GPU 时间未测量",
    "yard": "户外",
    "home": "居家",
    "saveError": "浏览器保存失败，请保留分页",
    "readError": "无法读取本地存档",
    "contextLost": "图形内容已中断，请重新载入以恢复存档。",
    "saved": "已保存",
    "arrived": "已抵达",
    "walkingDoor": "正在走向门口",
    "rewindBusy": "转景途中无法倒转",
    "rewound": "已倒转 {seconds} 秒；按“暂停／继续”恢复",
    "diagnostic": "详细信息",
    "clock": "时间",
    "buttons": {
      "0": "暂停／继续",
      "1": "速度",
      "2": "自主生活",
      "20": "吃饭",
      "21": "休息",
      "22": "休闲",
      "23": "工作",
      "30": "室内／户外",
      "4": "取消",
      "10": "倒转 5 秒",
      "6": "居家服",
      "7": "户外服",
      "5": "保存"
    }
  }
};
function chooseLocale(languages){
 for(const raw of languages){const s=raw.toLowerCase();
  if(s.startsWith('zh'))return s.includes('hans')?'zh-Hans':/hant|tw|hk|mo/.test(s)?'zh-Hant':'zh-Hans';
  if(s.startsWith('en'))return 'en';
 }return 'en';
}
let locale=chooseLocale(navigator.languages||[navigator.language||'en']);
try{const saved=localStorage.getItem('abyss-preview-language');if(messages[saved])locale=saved;}catch{}
const tr=key=>messages[locale][key]??messages.en[key]??key;
const num=(value,digits=0)=>new Intl.NumberFormat(locale,{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);
function noticeText(raw){
 const key={'Saved':'saved','Arrived':'arrived','Walking to the door':'walkingDoor','Rewind unavailable during scene travel':'rewindBusy'}[raw];
 if(key)return tr(key);
 const rewind=raw.match(/^Rewound ([0-9.]+)s; Space resumes$/);
 if(rewind)return tr('rewound').replace('{seconds}',num(Number(rewind[1]),2));
 // Keep the original diagnostic code and detail for repair; never disguise unknown errors.
 return /^E_[A-Z_]+/.test(raw)?`${tr('noticeError')} · ${raw}`:raw;
}
function applyLocale(){
 document.documentElement.lang=locale;document.title=`Abyss · ${tr('title')} · ${tr('preview')}`;
 document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=tr(e.dataset.i18n));
 document.querySelectorAll('[data-label]').forEach(e=>e.setAttribute('aria-label',tr(e.dataset.label)));
 document.querySelectorAll('[data-c]').forEach(e=>e.textContent=tr('buttons')[e.dataset.c]);
 document.querySelector('#language').value=locale;
}
