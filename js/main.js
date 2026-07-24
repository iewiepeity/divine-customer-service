// ============================================================
// Entry point — title screen wiring + game boot.
// ============================================================
import { Game } from "./engine/game.js";
import { openingScript } from "./data/script.js";
import { saveManager } from "./engine/save.js";
import { audio } from "./engine/audio.js";
import { roster } from "./engine/roster.js";
import { deities } from "./data/deities.js";

const titleScreen = document.getElementById("title-screen");
const btnNew = document.getElementById("btn-new-game");
const btnContinue = document.getElementById("btn-continue");
const btnRoster = document.getElementById("btn-roster");
const muteBtn = document.getElementById("mute-btn");

btnRoster.addEventListener("click", () => roster.open(deities));

muteBtn.textContent = audio.muted ? "🔇" : "🔊";
muteBtn.addEventListener("click", () => {
  const muted = audio.toggleMute();
  muteBtn.textContent = muted ? "🔇" : "🔊";
});

if (saveManager.hasSave()) {
  btnContinue.classList.remove("hidden");
}

const game = new Game(openingScript);

function launch(fromIndex) {
  titleScreen.classList.add("hidden");
  audio.click();
  game.start(fromIndex);
}

btnNew.addEventListener("click", () => {
  saveManager.clear();
  launch(0);
});

btnContinue.addEventListener("click", () => {
  const data = saveManager.load();
  launch(data && typeof data.nodeIndex === "number" ? data.nodeIndex : 0);
});
