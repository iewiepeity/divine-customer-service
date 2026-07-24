// ============================================================
// Modal — item / document inspection popup. Supports multi-page
// content (used by 文件, and reusable for anything else).
// ============================================================
import { audio } from "./audio.js";

export class Modal {
  constructor() {
    this.layer = document.getElementById("modal-layer");
    this.imageEl = document.getElementById("modal-image");
    this.titleEl = document.getElementById("modal-title");
    this.bodyEl = document.getElementById("modal-body");
    this.navEl = document.getElementById("modal-nav");
    this.pageEl = document.getElementById("modal-page");
    this.prevBtn = document.getElementById("modal-prev");
    this.nextBtn = document.getElementById("modal-next");
    this.closeBtn = document.getElementById("modal-close");

    this.pages = [];
    this.pageIndex = 0;
    this.onCloseCb = null;

    this.prevBtn.addEventListener("click", () => this._go(-1));
    this.nextBtn.addEventListener("click", () => this._go(1));
    this.closeBtn.addEventListener("click", () => this.close());
    this.layer.addEventListener("click", (e) => {
      if (e.target === this.layer) this.close();
    });
  }

  /**
   * title: string
   * pages: string[] (one or more pages of body text)
   * opts.image: optional portrait/illustration URL shown above the title
   */
  open(title, pages, onClose, opts = {}) {
    audio.pageTurn();
    if (opts.image) {
      this.imageEl.src = opts.image;
      this.imageEl.classList.remove("hidden");
    } else {
      this.imageEl.removeAttribute("src");
      this.imageEl.classList.add("hidden");
    }
    this.titleEl.textContent = title;
    this.pages = Array.isArray(pages) ? pages : [pages];
    this.pageIndex = 0;
    this.onCloseCb = onClose || null;
    this.layer.classList.remove("hidden");
    this._render();
  }

  _render() {
    this.bodyEl.textContent = this.pages[this.pageIndex];
    if (this.pages.length > 1) {
      this.navEl.classList.remove("hidden");
      this.pageEl.textContent = `${this.pageIndex + 1} / ${this.pages.length}`;
      this.prevBtn.disabled = this.pageIndex === 0;
      this.nextBtn.disabled = this.pageIndex === this.pages.length - 1;
    } else {
      this.navEl.classList.add("hidden");
    }
  }

  _go(delta) {
    const next = this.pageIndex + delta;
    if (next < 0 || next >= this.pages.length) return;
    audio.pageTurn();
    this.pageIndex = next;
    this._render();
  }

  close() {
    audio.click();
    this.layer.classList.add("hidden");
    const cb = this.onCloseCb;
    this.onCloseCb = null;
    if (cb) cb();
  }
}

export const modal = new Modal();
