// ============================================================
// ChoiceUI — ④ Choice UI. Supports 2~6 options.
// Selecting an option can branch flavor text (line/affinity/easter-egg)
// without ever gating the main story.
// ============================================================
import { audio } from "./audio.js";
import { interpolate } from "./variables.js";

export class ChoiceUI {
  constructor() {
    this.layer = document.getElementById("choice-layer");
  }

  show(prompt, options, onPick) {
    this.layer.innerHTML = "";
    this.layer.classList.remove("hidden");
    this.layer.style.pointerEvents = "auto";

    if (prompt) {
      const p = document.createElement("div");
      p.className = "choice-prompt";
      p.textContent = interpolate(prompt);
      this.layer.appendChild(p);
    }

    const group = document.createElement("div");
    group.className = "choice-options";
    if (options.length >= 4) group.classList.add("choice-grid");
    this.layer.appendChild(group);

    options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerHTML = `<span class="num">${i + 1}</span>${interpolate(opt.label)}`;
      btn.addEventListener("mouseenter", () => audio.hover());
      btn.addEventListener("click", (e) => {
        audio.click();
        this.layer.style.pointerEvents = "none";
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "choice-ripple";
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        btn.appendChild(ripple);
        btn.classList.add("picked");
        setTimeout(() => {
          this.hide();
          onPick(i, opt);
        }, 200);
      });
      group.appendChild(btn);
    });
  }

  hide() {
    this.layer.classList.add("hidden");
    this.layer.innerHTML = "";
  }
}

export const choiceUI = new ChoiceUI();
