// ============================================================
// Gallery — "official character introduction" screen for the
// 客服靈 (一號/二號/三號), reusable for any future character debut.
// Shows one character at a time (desktop: portrait left / info right,
// mobile: portrait top / info bottom) with fade+slide switching,
// rather than three simultaneous mini-cards.
// ============================================================
import { audio } from "./audio.js";
import { interpolate } from "./variables.js";

export class Gallery {
  constructor() {
    this.layer = document.getElementById("interaction-layer");
    this.chars = [];
    this.index = 0;
    this.viewed = new Set();
    this.onComplete = null;
    this.opts = {};
  }

  /**
   * chars: [{ id, slotClass, colorTheme, tag, name, image, age, height,
   *           appearance, personality, skill, weakness, quote }]
   * onComplete fires once every character has been viewed at least once.
   */
  reveal(chars, onComplete, opts = {}) {
    this.layer.innerHTML = "";
    this.chars = chars;
    this.index = 0;
    this.viewed = new Set([0]);
    this.onComplete = onComplete;
    this.opts = opts;

    const wrap = document.createElement("div");
    wrap.className = "char-intro";
    wrap.innerHTML = `
      <div class="char-intro-row">
        <button class="char-nav char-nav-prev" aria-label="上一位客服靈"><span></span></button>
        <div class="char-intro-stage">
          <div class="char-intro-portrait">
            <div class="char-intro-portrait-img"></div>
          </div>
          <div class="char-intro-info">
            <div class="char-intro-tag"></div>
            <h2 class="char-intro-name"></h2>
            <div class="char-intro-meta">
              <span class="char-intro-age"></span>
              <span class="char-intro-height"></span>
            </div>
            <dl class="char-intro-fields">
              <dt>性格</dt><dd class="f-personality"></dd>
              <dt>擅長</dt><dd class="f-skill"></dd>
              <dt>缺點</dt><dd class="f-weakness"></dd>
            </dl>
            <div class="char-intro-quote"></div>
          </div>
        </div>
        <button class="char-nav char-nav-next" aria-label="下一位客服靈"><span></span></button>
      </div>
      <div class="char-intro-dots"></div>
    `;
    this.layer.appendChild(wrap);
    this.wrap = wrap;
    this.stage = wrap.querySelector(".char-intro-stage");
    this.dotsEl = wrap.querySelector(".char-intro-dots");

    chars.forEach((c, i) => {
      const dot = document.createElement("button");
      dot.className = "char-dot";
      dot.setAttribute("aria-label", c.name);
      dot.addEventListener("click", () => this._goTo(i, i > this.index ? 1 : -1));
      this.dotsEl.appendChild(dot);
    });

    wrap.querySelector(".char-nav-prev").addEventListener("click", () => {
      this._goTo((this.index - 1 + chars.length) % chars.length, -1);
    });
    wrap.querySelector(".char-nav-next").addEventListener("click", () => {
      this._goTo((this.index + 1) % chars.length, 1);
    });

    this._render();
    setTimeout(() => audio.divinePower(), 150);

    if (!opts.autoAdvance) {
      const cont = document.createElement("button");
      cont.id = "explore-continue";
      cont.className = "gallery-continue";
      cont.textContent = "繼續";
      cont.addEventListener("click", () => {
        audio.click();
        this.clear();
        if (onComplete) onComplete();
      });
      // sits on the layer, not inside the card, so it can never
      // overlap the character's text
      this.layer.appendChild(cont);
    }
  }

  _goTo(i, dir) {
    if (i === this.index) return;
    audio.click();
    this.viewed.add(i);
    this.stage.classList.add(dir > 0 ? "slide-out-left" : "slide-out-right");
    setTimeout(() => {
      this.index = i;
      this._render();
      this.stage.classList.remove("slide-out-left", "slide-out-right");
      this.stage.classList.add(dir > 0 ? "slide-in-right" : "slide-in-left");
      setTimeout(() => this.stage.classList.remove("slide-in-right", "slide-in-left"), 420);
    }, 220);

    if (this.viewed.size >= this.chars.length && !this.opts.autoAdvance) {
      const cont = document.getElementById("explore-continue");
      if (cont) cont.classList.add("show");
    } else if (this.viewed.size >= this.chars.length && this.opts.autoAdvance) {
      this.clear();
      if (this.onComplete) this.onComplete();
    }
  }

  _render() {
    const c = this.chars[this.index];
    this.wrap.className = `char-intro ${c.colorTheme || ""}`;
    const portraitImg = this.wrap.querySelector(".char-intro-portrait-img");
    if (c.image) portraitImg.style.backgroundImage = `url("${c.image}")`;
    this.wrap.querySelector(".char-intro-tag").textContent = interpolate(c.tag || "");
    this.wrap.querySelector(".char-intro-name").textContent = interpolate(c.name || "");
    this.wrap.querySelector(".char-intro-age").textContent = c.age || "";
    this.wrap.querySelector(".char-intro-height").textContent = c.height || "";
    this.wrap.querySelector(".f-personality").textContent = interpolate(c.personality || "");
    this.wrap.querySelector(".f-skill").textContent = interpolate(c.skill || "");
    this.wrap.querySelector(".f-weakness").textContent = interpolate(c.weakness || "");
    this.wrap.querySelector(".char-intro-quote").textContent = interpolate(c.quote || "");
    [...this.dotsEl.children].forEach((d, i) => d.classList.toggle("active", i === this.index));
  }

  clear() {
    this.layer.innerHTML = "";
  }
}

export const gallery = new Gallery();
