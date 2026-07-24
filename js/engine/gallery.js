// ============================================================
// Gallery — clickable "character card" reveal, used for the
// 客服靈 (一號/二號/三號) introduction and reusable for any future
// character debut.
// ============================================================
import { audio } from "./audio.js";
import { modal } from "./modal.js";

export class Gallery {
  constructor() {
    this.layer = document.getElementById("interaction-layer");
  }

  /**
   * chars: [{ id, slotClass, icon, tag, name, height, feature, personality, skill }]
   * onComplete fires once every card has been opened at least once.
   */
  reveal(chars, onComplete, opts = {}) {
    this.layer.innerHTML = "";
    const visited = new Set();

    chars.forEach((c, i) => {
      const slot = document.createElement("div");
      slot.className = `char-slot ${c.slotClass}`;
      slot.innerHTML = `
        <div class="char-figure">${c.icon || ""}</div>
        <div class="char-tag">${c.tag}</div>
      `;
      slot.addEventListener("mouseenter", () => audio.hover());
      slot.addEventListener("click", () => {
        audio.click();
        const body =
          `姓名：${c.name}\n` +
          `身高：${c.height}\n` +
          `特徵：${c.feature}\n` +
          `性格：${c.personality}\n` +
          `擅長：${c.skill}`;
        modal.open(c.name, [body], () => {
          visited.add(c.id);
          if (visited.size >= chars.length) {
            if (opts.autoAdvance) {
              this.clear();
              if (onComplete) onComplete();
            } else {
              const cont = document.getElementById("explore-continue");
              if (cont) cont.classList.add("show");
            }
          }
        });
      });
      this.layer.appendChild(slot);

      setTimeout(() => {
        audio.divinePower();
        slot.classList.add("show");
      }, 400 + i * 500);
    });

    if (!opts.autoAdvance) {
      const cont = document.createElement("button");
      cont.id = "explore-continue";
      cont.textContent = "繼續";
      cont.addEventListener("click", () => {
        audio.click();
        this.clear();
        if (onComplete) onComplete();
      });
      this.layer.appendChild(cont);
    }
  }

  clear() {
    this.layer.innerHTML = "";
  }
}

export const gallery = new Gallery();
