// ============================================================
// DialogueBox — ② Dialogue Box
// Supports: typewriter effect, click-to-reveal-full-text,
// click-again-to-advance. Never force-waits on the player.
// ============================================================
import { typewrite } from "./typewriter.js";
import { audio } from "./audio.js";

export class DialogueBox {
  constructor() {
    this.box = document.getElementById("dialogue-box");
    this.nameEl = document.getElementById("speaker-name");
    this.textEl = document.getElementById("dialogue-text");
    this.queue = [];
    this.index = 0;
    this.typer = null;
    this.onComplete = null;
    this.active = false;

    this.box.addEventListener("click", () => this._advance());
  }

  hide() {
    this.box.classList.add("hidden");
    this.active = false;
  }

  /**
   * lines: Array<string | {speaker?: string, text: string}>
   * onComplete: called once every line has been shown & clicked through
   */
  play(lines, onComplete) {
    this.queue = lines.map((l) => (typeof l === "string" ? { speaker: null, text: l } : l));
    this.index = 0;
    this.onComplete = onComplete;
    this.active = true;
    this.box.classList.remove("hidden");
    this._showCurrent();
  }

  _showCurrent() {
    const line = this.queue[this.index];
    if (!line) return;
    if (line.speaker) {
      this.nameEl.textContent = line.speaker;
      this.nameEl.classList.add("show");
    } else {
      this.nameEl.classList.remove("show");
    }
    if (this.typer) this.typer.cancel();
    this.typer = typewrite(this.textEl, line.text, { minMs: 40, maxMs: 60 });
  }

  _advance() {
    if (!this.active) return;
    audio.click();
    if (this.typer && !this.typer.isDone) {
      this.typer.skip();
      return;
    }
    this.index += 1;
    if (this.index >= this.queue.length) {
      this.active = false;
      const cb = this.onComplete;
      this.onComplete = null;
      if (cb) cb();
      return;
    }
    this._showCurrent();
  }
}

export const dialogueBox = new DialogueBox();
