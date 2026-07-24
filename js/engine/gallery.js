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
   * chars: [{ id, slotClass, icon, tag, name, image, appearance, personality, skill, weakness }]
   * onComplete fires once every card has been opened at least once.
   */
  reveal(chars, onComplete, opts = {}) {
    this.layer.innerHTML = "";
    const visited = new Set();

    chars.forEach((c, i) => {
      const slot = document.createElement("div");
      slot.className = `char-slot ${c.slotClass}`;
      const figure = document.createElement("div");
      figure.className = "char-figure";
      if (c.image) {
        figure.style.backgroundImage = `url("${c.image}")`;
        figure.style.backgroundSize = "cover";
        figure.style.backgroundPosition = "center 18%";
      } else {
        figure.textContent = c.icon || "";
      }
      const tag = document.createElement("div");
      tag.className = "char-tag";
      tag.textContent = c.tag;
      slot.appendChild(figure);
      slot.appendChild(tag);
      slot.addEventListener("mouseenter", () => audio.hover());
      slot.addEventListener("click", () => {
        audio.click();
        const body =
          `姓名：${c.name}\n` +
          `外貌：${c.appearance}\n` +
          `性格：${c.personality}\n` +
          `擅長：${c.skill}\n` +
          `缺點：${c.weakness}`;
        modal.open(
          c.name,
          [body],
          () => {
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
          },
          { image: c.image }
        );
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
