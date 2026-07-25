// ============================================================
// Entry point — loading screen, title screen, nickname entry,
// and game boot.
// ============================================================
import { Game } from "./engine/game.js";
import { openingScript } from "./data/script.js";
import { saveManager } from "./engine/save.js";
import { audio } from "./engine/audio.js";
import { roster } from "./engine/roster.js";
import { deities } from "./data/deities.js";
import { setVar } from "./engine/variables.js";

// ---------------------------------------------------------------
// Loading screen
// ---------------------------------------------------------------
const loadingScreen = document.getElementById("loading-screen");
const loadingLine = document.getElementById("loading-line");

const LOADING_LINES = [
  "正在連線神明客服中心……",
  "一號正在確認流程。",
  "二號跑去聊天了。",
  "三號好像又迷路了。",
  "玉皇大帝表示現有人力尚可調度。",
];

function bootLoadingScreen() {
  let lineIndex = 0;
  loadingLine.textContent = LOADING_LINES[0];
  const rotateTimer = setInterval(() => {
    lineIndex = (lineIndex + 1) % LOADING_LINES.length;
    loadingLine.textContent = LOADING_LINES[lineIndex];
  }, 750);

  const start = performance.now();
  const MIN_MS = 500;
  const TIMEOUT_MS = 4000;
  let settled = false;

  const finish = () => {
    if (settled) return;
    settled = true;
    const elapsed = performance.now() - start;
    const remaining = Math.max(0, MIN_MS - elapsed);
    setTimeout(() => {
      clearInterval(rotateTimer);
      loadingScreen.classList.add("hidden");
    }, remaining);
  };

  const coverImg = new Image();
  coverImg.onload = finish;
  coverImg.onerror = () => {
    loadingLine.textContent = "部分圖片載入失敗，仍可繼續遊戲。";
    setTimeout(finish, 500);
  };
  coverImg.src = "assets/backgrounds/title-cover.jpg";
  setTimeout(finish, TIMEOUT_MS);
}

bootLoadingScreen();

// ---------------------------------------------------------------
// Title screen / nickname entry / boot
// ---------------------------------------------------------------
const titleScreen = document.getElementById("title-screen");
const btnNew = document.getElementById("btn-new-game");
const btnContinue = document.getElementById("btn-continue");
const btnRoster = document.getElementById("btn-roster");
const btnSettings = document.getElementById("btn-settings");
const muteBtn = document.getElementById("mute-btn");

const settingsScreen = document.getElementById("settings-screen");
const settingsClose = document.getElementById("settings-close");
const settingsSound = document.getElementById("settings-sound");
const settingsClear = document.getElementById("settings-clear");

const nicknameScreen = document.getElementById("nickname-screen");
const nicknameInput = document.getElementById("nickname-input");
const nicknameError = document.getElementById("nickname-error");
const nicknameConfirm = document.getElementById("nickname-confirm");

btnRoster.addEventListener("click", () => roster.open(deities));

// Sound state is shared between the HUD mute button and the settings
// panel toggle, so flipping either one keeps both in sync.
function syncSoundUi() {
  muteBtn.classList.toggle("is-muted", audio.muted);
  settingsSound.setAttribute("aria-pressed", audio.muted ? "false" : "true");
}
syncSoundUi();

muteBtn.addEventListener("click", () => {
  audio.toggleMute();
  syncSoundUi();
});

settingsSound.addEventListener("click", () => {
  audio.toggleMute();
  syncSoundUi();
  audio.click();
});

// 繼續遊戲 is drawn into the key art, so it is unlocked rather than
// revealed — it stays visible but inert until there is a save.
function refreshContinueState() {
  const has = saveManager.hasSave();
  btnContinue.classList.toggle("is-locked", !has);
  btnContinue.disabled = !has;
}
refreshContinueState();

btnSettings.addEventListener("click", () => {
  audio.click();
  settingsClear.classList.remove("confirming");
  settingsClear.textContent = "清除進度";
  settingsScreen.classList.remove("hidden");
});

function closeSettings() {
  audio.click();
  settingsScreen.classList.add("hidden");
}
settingsClose.addEventListener("click", closeSettings);
settingsScreen.addEventListener("click", (e) => {
  if (e.target === settingsScreen) closeSettings();
});

// Two-step so a stray tap can never wipe a playthrough.
settingsClear.addEventListener("click", () => {
  audio.click();
  if (!settingsClear.classList.contains("confirming")) {
    settingsClear.classList.add("confirming");
    settingsClear.textContent = "確定清除？";
    return;
  }
  saveManager.clear();
  refreshContinueState();
  settingsClear.classList.remove("confirming");
  settingsClear.textContent = "已清除";
  setTimeout(() => { settingsClear.textContent = "清除進度"; }, 1400);
});

const game = new Game(openingScript);

function launch(fromIndex) {
  titleScreen.classList.add("hidden");
  document.getElementById("hud").classList.remove("hidden");
  audio.click();
  game.start(fromIndex);
}

btnNew.addEventListener("click", () => {
  saveManager.clear();
  setVar("nickname", "主管");
  audio.click();
  titleScreen.classList.add("hidden");
  nicknameScreen.classList.remove("hidden");
  nicknameError.classList.remove("show");
  nicknameInput.value = "";
  nicknameInput.focus();
});

function confirmNickname() {
  const value = nicknameInput.value.trim();
  if (!value) {
    audio.click();
    nicknameError.classList.add("show");
    nicknameInput.classList.add("shake");
    setTimeout(() => nicknameInput.classList.remove("shake"), 420);
    nicknameInput.focus();
    return;
  }
  setVar("nickname", value);
  saveManager.save({ nickname: value });
  audio.stamp();
  nicknameScreen.classList.add("hidden");
  launch(0);
}

nicknameConfirm.addEventListener("click", confirmNickname);
nicknameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") confirmNickname();
});

btnContinue.addEventListener("click", () => {
  const data = saveManager.load();
  if (data && data.nickname) setVar("nickname", data.nickname);
  launch(data && typeof data.nodeIndex === "number" ? data.nodeIndex : 0);
});

// 重新遊玩 — from the closing CTA, back to the title screen for another run.
// The save is dropped because it points at the ending; continuing into a
// finished run would just drop the player back on this same screen.
document.getElementById("cta-replay").addEventListener("click", () => {
  audio.click();
  game.reset();
  saveManager.clear();
  refreshContinueState();
  titleScreen.classList.remove("hidden");
});
