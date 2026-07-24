// ============================================================
// 神明客服中心 — 開場劇本
// 全部以「節點（node）」資料驅動，Scene / Dialogue / Choice / Explore
// 皆為模組化元件，未來可直接新增節點來擴充：神明登場、主線劇情、
// 特殊事件、節日活動、戀愛事件……而不需要更動引擎程式碼。
// ============================================================
import { serviceSpirits } from "./characters.js";

const DESK_DECO = `<div class="desk-shape"></div>`;
const HEAVEN_DECO = `<div class="throne-glow"></div><div class="god-figure"></div>`;
const CASE_DECO = `<div class="phone-case-shape"></div>`;

export const openingScript = [
  // ---------------------------------------------------------
  // Scene_01 — 黑畫面
  // ---------------------------------------------------------
  {
    scene: "Scene_01",
    type: "dialogue",
    background: "bg-black",
    transition: "none",
    lines: ["……", "……", "你死了。"],
  },

  // ---------------------------------------------------------
  // Scene_02 — 沒有奈何橋
  // ---------------------------------------------------------
  {
    scene: "Scene_02",
    type: "dialogue",
    background: "bg-void",
    transition: "fade",
    lines: [
      "沒有奈何橋。",
      "沒有孟婆湯。",
      "也沒有天使前來迎接你。",
      "只有一片，安靜的，白光。",
      "以及——一張辦公桌。",
    ],
  },

  // ---------------------------------------------------------
  // Scene_03 — 主管辦公桌（Explore Mode）
  // ---------------------------------------------------------
  {
    scene: "Scene_03",
    type: "explore",
    background: "bg-office",
    transition: "paper",
    deco: DESK_DECO,
    introLines: ["你回過神時，已經坐在這張陌生的辦公桌前。", "桌上放著幾樣東西，看起來……都不像是人間的物品。"],
    items: [
      {
        id: "nokia",
        icon: "📱",
        label: "Nokia 3310",
        x: 26,
        y: 73,
        title: "Nokia 3310",
        pages: ["神機。\n\n永不沒電。\n永不損壞。\n\n——不得關機。"],
      },
      {
        id: "badge",
        icon: "📛",
        label: "識別證",
        x: 42,
        y: 69,
        title: "識別證",
        pages: ["主管\n\n員工編號：\n尚未登錄"],
      },
      {
        id: "docs",
        icon: "📁",
        label: "文件",
        x: 58,
        y: 73,
        title: "文件",
        pages: [
          "（第一頁）\n密密麻麻的行政條文，一個字都看不懂。",
          "（第二頁）\n依然看不懂，上面蓋滿了各種奇怪的硃紅印章。",
          "（最後一頁）\n你決定，等等再看。",
        ],
      },
      {
        id: "meds",
        icon: "💊",
        label: "藥袋",
        x: 74,
        y: 76,
        title: "藥袋",
        pages: [
          "一個粉紅色小藥袋，上面貼著可愛貼紙：「天庭衛生所　敬贈」。",
          "警語欄手寫著：「服用後可能出現遺忘、放空、突然很想睡等症狀（其實就是孟婆湯的效果）。」",
          "內容物：七顆糖果狀的『忘塵丸』，附註——\n「本季孟婆湯預算被砍了，改發這個，一樣有效，請見諒 🙏」",
        ],
      },
    ],
  },

  // ---------------------------------------------------------
  // 玉皇大帝登場
  // ---------------------------------------------------------
  {
    scene: "Scene_04",
    type: "dialogue",
    background: "bg-heaven",
    transition: "light",
    deco: HEAVEN_DECO,
    lines: [
      "在你想通任何事情之前——",
      "眼前的畫面，忽然被一片金光吞沒。",
      { speaker: "玉皇大帝", text: "醒了？" },
      { speaker: "玉皇大帝", text: "別緊張，你沒有走錯地方——雖然也沒有走對地方就是了。" },
      { speaker: "玉皇大帝", text: "這裡是「神明客服中心」，負責處理天下所有祈願、投訴與催辦案件。" },
      { speaker: "玉皇大帝", text: "而你桌上那張識別證，剛才已經自動登錄完成。" },
      { speaker: "玉皇大帝", text: "恭喜，你是新任主管。" },
    ],
  },

  // ---------------------------------------------------------
  // 來電紀錄（卷宗）
  // ---------------------------------------------------------
  {
    scene: "Scene_05",
    type: "callRecord",
    background: "bg-heaven-alert",
    transition: "fade",
    deco: HEAVEN_DECO,
    introLines: [
      { speaker: "玉皇大帝", text: "這是最近一位陳情人的紀錄，你自己翻翻看。" },
      "殿中央，一卷巨大的卷宗緩緩攤開。",
    ],
    hotspot: { icon: "📜", label: "巨大卷宗", x: 50, y: 55 },
    title: "陳情人來電紀錄",
    fields: [
      { label: "姓名", value: "王大明" },
      { label: "祈願次數", value: "1,428 次" },
      { label: "催辦次數", value: "312 次" },
      { label: "正式客訴", value: "47 件" },
      { label: "重複許願", value: "「希望考上公務員」（連續第 7 年）" },
    ],
  },

  // ---------------------------------------------------------
  // 第一個選擇
  // ---------------------------------------------------------
  {
    scene: "Scene_06",
    type: "choice",
    background: "bg-heaven",
    transition: "none",
    prompt: "玉皇大帝瞇起眼：「看得出來，你生前對客服流程十分熟悉。」",
    options: [
      {
        label: "我沒有。",
        response: [{ speaker: "玉皇大帝", text: "喔？那更好——代表你是被冤枉分發過來的，境界比較高。" }],
      },
      {
        label: "那是你們效率太差。",
        response: [
          { speaker: "玉皇大帝", text: "……" },
          { speaker: "玉皇大帝", text: "看來你很有潛力。" },
        ],
      },
      {
        label: "我想投胎。",
        response: [{ speaker: "玉皇大帝", text: "投胎申請表在三號窗口，記得先把手上的案件結掉再說。" }],
      },
    ],
  },

  // ---------------------------------------------------------
  // 客服靈登場
  // ---------------------------------------------------------
  {
    scene: "Scene_07",
    type: "gallery",
    background: "bg-spotlight",
    transition: "light",
    sfxOnEnter: "divinePower",
    introLines: [
      { speaker: "玉皇大帝", text: "接下來，讓你認識一下你的下屬。" },
      "殿內光線一沉。",
      "三道金光，緩緩落下。",
    ],
    chars: serviceSpirits.map((c) => ({
      id: c.id,
      slotClass: c.slotClass,
      icon: c.icon,
      tag: c.tag,
      name: c.name,
      height: c.height,
      feature: c.feature,
      personality: c.personality,
      skill: c.skill,
    })),
  },

  // ---------------------------------------------------------
  // 第一件案件送達
  // ---------------------------------------------------------
  {
    scene: "Scene_08",
    type: "dialogue",
    background: "bg-case",
    transition: "zoom",
    deco: CASE_DECO,
    sfxOnEnter: "phoneRing",
    lines: [
      "時間，來到 09:00。",
      "四支 Nokia 3310，同時嘶吼般地震動、響起。",
      "第一件案件，正式送達。",
      "陳情人：林小姐，25 歲。",
      "祈願內容：「希望能多睡十分鐘」。",
      "——附註：本案陳情人已連續敲響鬧鐘 214 次。",
    ],
  },

  // ---------------------------------------------------------
  // 第一次派遣（正式互動）
  // ---------------------------------------------------------
  {
    scene: "Scene_09",
    type: "dispatchChoice",
    background: "bg-case",
    transition: "none",
    sfxOnEnter: "vibrate",
    prompt: "這件案子，你打算派誰去處理？",
    options: [
      {
        label: "自己出馬",
        response: [
          "你深吸一口氣，抓起桌上的 Nokia 3310。",
          "身為新任主管，第一件案子，你決定親自處理。",
          { speaker: "玉皇大帝", text: "……有膽識。我喜歡。" },
        ],
      },
      {
        label: "派遣一號",
        response: [
          "一號額頭上的電話圖示瘋狂閃爍，整個人已經衝了出去。",
          { speaker: "一號", text: "包在我身上！絕對讓她多睡到！" },
          { speaker: "玉皇大帝", text: "……他好像沒聽完案情。" },
        ],
      },
      {
        label: "派遣二號",
        response: [
          "二號翻開手中的《天界服務條款》，眼神銳利。",
          { speaker: "二號", text: "根據第九條第三項，睡眠請求需先確認陳情人作息紀錄……" },
          { speaker: "玉皇大帝", text: "……他會先花三小時看條文。" },
        ],
      },
      {
        label: "派遣三號",
        response: [
          "三號面無表情地點了點頭，轉身就走，沒有多說一句話。",
          "沒有人知道他打算怎麼做。",
          { speaker: "玉皇大帝", text: "……安靜的案子，交給他最安心。" },
        ],
      },
    ],
  },

  // ---------------------------------------------------------
  // 開場結束
  // ---------------------------------------------------------
  {
    scene: "Scene_end",
    type: "end",
    background: "bg-case",
    transition: "fade",
    lines: [
      "案件編號 001，正式進入處理程序。",
      "而你的第一天，才剛剛開始。",
    ],
    endTitle: "第一章・待續",
    endText: "《神明客服中心》開場 Demo 到此結束。\n\n更多案件、更多客服靈、更多故事，敬請期待正式版本。",
  },
];
