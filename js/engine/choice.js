// ============================================================
// ChoiceUI — ④ Choice UI. Supports 2~6 options.
// Selecting an option can branch flavor text (line/affinity/easter-egg)
// without ever gating the main story.
// ============================================================
import { audio } from "./audio.js";

export class ChoiceUI {
  constructor() {
    this.layer = document.getElementById("choice-layer");
  }

  show(prompt, options, onPick) {
    this.layer.innerHTML = "";
    this.layer.classList.remove("hidden");

    if (prompt) {
      const p = document.createElement("div");
      p.className = "choice-prompt";
      p.textContent = prompt;
      this.layer.appendChild(p);
    }

    options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerHTML = `<span class="num">${i + 1}</span>${opt.label}`;
      btn.addEventListener("mouseenter", () => audio.hover());
      btn.addEventListener("click", () => {
        audio.click();
        this.hide();
        onPick(i, opt);
      });
      this.layer.appendChild(btn);
    });
  }

  hide() {
    this.layer.classList.add("hidden");
    this.layer.innerHTML = "";
  }
}

export const choiceUI = new ChoiceUI();
