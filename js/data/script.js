// ============================================================
// 神明客服中心 — 開場劇本
// 全部以「節點（node）」資料驅動，Scene / Dialogue / Choice / Explore
// 皆為模組化元件，未來可直接新增節點來擴充：神明登場、主線劇情、
// 特殊事件、節日活動、戀愛事件……而不需要更動引擎程式碼。
// ============================================================
import { serviceSpirits } from "./characters.js";

const YUHUANG = "assets/deities/yuhuangdadi.jpg";

// 一號＝左／二號＝中／三號＝右，全劇固定不變（辦公室場景共用同一份 deco）
const OFFICE_SPIRITS_DECO =
  `<div class="office-spirit office-spirit-left" style="background-image:url('assets/characters/one.jpg')"></div>` +
  `<div class="office-spirit office-spirit-center" style="background-image:url('assets/characters/two.jpg')"></div>` +
  `<div class="office-spirit office-spirit-right" style="background-image:url('assets/characters/three.jpg')"></div>`;

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
    transition: "cloud",
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
    introLines: ["你回過神時，已經坐在這張陌生的辦公桌前。", "桌上放著幾樣東西，看起來……都不像是人間的物品。"],
    items: [
      {
        id: "nokia",
        icon: "📱",
        image: "assets/items/nokia.png",
        label: "Nokia 3310",
        x: 64,
        y: 62,
        title: "Nokia 3310",
        pages: ["神機。\n\n永不沒電。\n永不損壞。\n\n——不得關機。"],
      },
      {
        id: "badge",
        icon: "📛",
        image: "assets/items/badge.jpg",
        label: "識別證",
        x: 42,
        y: 65,
        title: "識別證",
        pages: ["主管\n\n員工編號：\n尚未登錄"],
      },
      {
        id: "docs",
        icon: "📁",
        image: "assets/items/docs.jpg",
        label: "文件",
        x: 14,
        y: 50,
        title: "文件",
        pages: [
          "（第一頁）\n公文卷宗，封面蓋著「機密文件　妥善保管」的硃紅印章。\n案件編號：SK-2024-05-00187\n案件類別：人間祈願相關事務",
          "（第二頁）\n密密麻麻的行政條文，一個字都看不懂，下方還有「綜合受理部　核章」的圓戳。",
          "（最後一頁）\n你決定，等等再看。",
        ],
      },
      {
        id: "meds",
        icon: "💊",
        image: "assets/items/meds.jpg",
        label: "藥袋",
        x: 88,
        y: 60,
        title: "藥袋",
        pages: [
          "一個粉紅色小藥袋，貼紙上畫著一隻捧著仙丹的兔子，寫著：「天庭衛生所　敬贈」。",
          "警語欄手寫著：「服用後可能出現遺忘、放空、突然很想睡等症狀（其實就是孟婆湯的效果）。」",
          "內容物：七顆糖果狀的『忘塵丸』，附註——\n「本季孟婆湯預算被砍了，改發這個，一樣有效，請見諒 🙏」",
        ],
      },
    ],
  },

  // ---------------------------------------------------------
  // 玉皇大帝登場 — 桌面探索 → Fade/Light → 神界大殿
  // ---------------------------------------------------------
  {
    scene: "Scene_04",
    type: "dialogue",
    background: "bg-heaven",
    transition: "light",
    portrait: YUHUANG,
    lines: [
      "在你想通任何事情之前——",
      "眼前的畫面，忽然被一片金光吞沒。",
      "金光散去時，你已經站在雲海之上的一座大殿正中央——神界最高議事廳。",
      { speaker: "玉皇大帝", text: "醒了？" },
      { speaker: "玉皇大帝", text: "別緊張，你沒有走錯地方——雖然也沒有走對地方就是了。" },
      { speaker: "玉皇大帝", text: "這裡是「神明客服中心」，負責處理天下所有祈願、投訴與催辦案件。" },
      { speaker: "玉皇大帝", text: "而你，恰好是本中心開業以來最『積極』的一位陳情人。" },
      { speaker: "玉皇大帝", text: "生前許願、催辦、客訴的次數，本座都還留著完整紀錄。" },
      { speaker: "玉皇大帝", text: "這種履歷，不用可惜了。" },
      { speaker: "玉皇大帝", text: "你桌上那張識別證，剛才已經自動登錄完成。" },
      { speaker: "玉皇大帝", text: "恭喜，{nickname}，你是本中心新任主管——強制徵召，即刻上任。" },
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
    portrait: YUHUANG,
    introLines: [
      { speaker: "玉皇大帝", text: "這是你生前的來電紀錄，你自己翻翻看。" },
      "殿中央，一卷巨大的卷宗緩緩攤開。",
    ],
    hotspot: { icon: "📜", label: "巨大卷宗", x: 50, y: 55 },
    title: "來電紀錄",
    fields: [
      { label: "姓名", value: "{nickname}" },
      { label: "祈願次數", value: "9,487 次" },
      { label: "催辦次數", value: "11,206 次" },
      { label: "正式客訴", value: "2,314 件" },
      { label: "重複向不同神明提出同一願望", value: "17 次" },
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
    portrait: YUHUANG,
    introLines: ["玉皇大帝闔上卷宗，意味深長地看著你。"],
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
        response: [{ speaker: "玉皇大帝", text: "待辦案件全數結清後，可以提出申請。" }],
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
    transition: "particle",
    sfxOnEnter: "divinePower",
    portrait: YUHUANG,
    introLines: [
      { speaker: "玉皇大帝", text: "接下來，讓你認識一下你的下屬。" },
      { speaker: "玉皇大帝", text: "他們不是人間招募來的員工，是本座親手創造的客服靈。" },
      "殿內光線一沉。",
      "三道金光，緩緩落下。",
    ],
    chars: serviceSpirits,
  },

  // ---------------------------------------------------------
  // 返回主管辦公室，客服靈站定位（玉皇大帝消失 → Fade → 辦公室）
  // ---------------------------------------------------------
  {
    scene: "Scene_08a",
    type: "dialogue",
    background: "bg-office",
    transition: "fade",
    deco: OFFICE_SPIRITS_DECO,
    lines: [
      "大殿的金光漸漸沉靜下來，玉皇大帝的身影也隱入雲霧之中。",
      "下一瞬間，眼前的景象已經換成了那張陌生的辦公桌——你回到了主管辦公室。",
      "一號、二號、三號，已經穩穩站在你身邊，各自站定了位置。",
    ],
  },

  // ---------------------------------------------------------
  // 第一件案件送達，HUD 正式啟用（正式開始工作才顯示）
  // ---------------------------------------------------------
  {
    scene: "Scene_08b",
    type: "dialogue",
    background: "bg-office",
    transition: "none",
    deco: OFFICE_SPIRITS_DECO,
    sfxOnEnter: "phoneRing",
    hud: {
      datetime: "週一　上午 09:00",
      location: "神明客服中心｜主管辦公室",
      pending: 30,
      spirits: [
        { name: "一號", status: "待命" },
        { name: "二號", status: "待命" },
        { name: "三號", status: "待命" },
      ],
    },
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
    background: "bg-office",
    transition: "none",
    deco: OFFICE_SPIRITS_DECO,
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
        hud: { pending: 29 },
        resultCard: {
          caseNo: "案件編號　SK-2024-06-00042",
          closeLabel: "結案歸檔",
          fields: [
            { label: "案件內容", value: "陳情人希望能多睡十分鐘" },
            { label: "派遣人員", value: "{nickname}（主管親自出馬）" },
            { label: "處理方式", value: "主管親自回電" },
            { label: "結果摘要", value: "第一次接案，當事人反過來安慰主管" },
            { label: "案件狀態", value: "暫時結案" },
            { label: "負責神明", value: "{nickname}" },
            { label: "是否需補件", value: "否" },
          ],
        },
      },
      {
        label: "派遣一號",
        response: [
          "一號戴上黑手套，抽出一份表單，開始逐條核對案件流程。",
          { speaker: "一號", text: "睡眠請求案件，依規定須先確認陳情人作息紀錄、鬧鐘型號與敲擊力道分佈圖。" },
          { speaker: "玉皇大帝", text: "……她會先花三小時把文件填完，再花五分鐘解決問題。" },
        ],
        hud: {
          pending: 29,
          spirits: [
            { name: "一號", status: "處理中", busy: true },
            { name: "二號", status: "待命" },
            { name: "三號", status: "待命" },
          ],
        },
        resultCard: {
          caseNo: "案件編號　SK-2024-06-00042",
          closeLabel: "結案歸檔",
          fields: [
            { label: "案件內容", value: "陳情人希望能多睡十分鐘" },
            { label: "派遣人員", value: "一號" },
            { label: "處理方式", value: "要求補齊作息紀錄與鬧鐘資料" },
            { label: "結果摘要", value: "案件尚未執行，文件已完成 87%" },
            { label: "案件狀態", value: "待補件" },
            { label: "負責神明", value: "一號（客服靈）" },
            { label: "是否需補件", value: "是" },
          ],
        },
      },
      {
        label: "派遣二號",
        response: [
          "二號晃著手中的手搖飲，接起粉色 Nokia，另一手已經在跟林小姐搏感情。",
          { speaker: "二號", text: "姊～我懂我懂，鬧鐘這種東西真的很煩對不對？來，跟我說說你昨天幾點睡的？" },
          { speaker: "玉皇大帝", text: "……才十秒，對方已經加他為好友了。" },
        ],
        hud: {
          pending: 29,
          spirits: [
            { name: "一號", status: "待命" },
            { name: "二號", status: "處理中", busy: true },
            { name: "三號", status: "待命" },
          ],
        },
        resultCard: {
          caseNo: "案件編號　SK-2024-06-00042",
          closeLabel: "結案歸檔",
          fields: [
            { label: "案件內容", value: "陳情人希望能多睡十分鐘" },
            { label: "派遣人員", value: "二號" },
            { label: "處理方式", value: "情緒安撫與作息訪談" },
            { label: "結果摘要", value: "成功取得信任，但通話時間超標" },
            { label: "案件狀態", value: "待文昌帝君審核" },
            { label: "負責神明", value: "文昌帝君（審核中）" },
            { label: "是否需補件", value: "否，待審核" },
          ],
        },
      },
      {
        label: "派遣三號",
        response: [
          "三號歪著頭想了想，肩上的小烏龜也跟著歪頭。",
          { speaker: "三號", text: "多睡十分鐘……那把她的鬧鐘調慢十分鐘不就好了？" },
          "沒有人來得及阻止他，他已經帶著烏龜衝出大殿。",
          { speaker: "玉皇大帝", text: "……我開始後悔了。" },
        ],
        hud: {
          pending: 29,
          spirits: [
            { name: "一號", status: "待命" },
            { name: "二號", status: "待命" },
            { name: "三號", status: "處理中", busy: true },
          ],
        },
        resultCard: {
          caseNo: "案件編號　SK-2024-06-00042",
          closeLabel: "結案歸檔",
          fields: [
            { label: "案件內容", value: "陳情人希望能多睡十分鐘" },
            { label: "派遣人員", value: "三號" },
            { label: "處理方式", value: "調慢鬧鐘" },
            { label: "結果摘要", value: "當事人多睡十分鐘，但整棟公寓時鐘皆慢十分鐘" },
            { label: "案件狀態", value: "需補救" },
            { label: "負責神明", value: "三號（客服靈）" },
            { label: "是否需補件", value: "是" },
          ],
        },
      },
    ],
  },

  // ---------------------------------------------------------
  // 序章結尾 — 電話又響，三人各說一句
  // ---------------------------------------------------------
  {
    scene: "Scene_10",
    type: "dialogue",
    background: "bg-office",
    transition: "none",
    deco: OFFICE_SPIRITS_DECO,
    sfxOnEnter: "phoneRing",
    lines: [
      { speaker: "一號", text: "主管，新的案件又進來了。" },
      { speaker: "二號", text: "今天只是開始哦。" },
      { speaker: "三號", text: "人間每天都有新的願望。" },
    ],
  },

  // ---------------------------------------------------------
  // 序章・完
  // ---------------------------------------------------------
  {
    scene: "Scene_chapterEnd",
    type: "chapterEnd",
    background: "bg-office",
    transition: "whiteout",
    title: "序章・完",
  },

  // ---------------------------------------------------------
  // CTA — 導流到正式遊戲
  // ---------------------------------------------------------
  {
    scene: "Scene_cta",
    type: "cta",
  },
];
