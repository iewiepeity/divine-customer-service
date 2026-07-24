// ============================================================
// Portrait — a single on-stage character sprite for dialogue-driven
// scenes (distinct from the interactive character galleries used by
// 客服靈/神明名冊). A node opts a character in via a `portrait` image
// path; any future character can appear this way without touching
// this module or the scene data format.
// ============================================================
export class Portrait {
  constructor() {
    this.el = document.getElementById("stage-portrait");
    this.img = document.getElementById("stage-portrait-img");
    this.current = null;
  }

  show(imageUrl) {
    if (!imageUrl) return;
    if (this.current === imageUrl && !this.el.classList.contains("hidden")) return;
    this.current = imageUrl;
    this.img.style.backgroundImage = `url("${imageUrl}")`;
    this.el.classList.remove("hidden", "portrait-exit");
    // restart the enter animation even if it was already mid-animation
    this.el.classList.remove("portrait-enter");
    void this.el.offsetWidth;
    this.el.classList.add("portrait-enter");
  }

  hide() {
    if (!this.current && this.el.classList.contains("hidden")) return;
    this.current = null;
    this.el.classList.remove("portrait-enter");
    this.el.classList.add("portrait-exit");
    setTimeout(() => {
      this.el.classList.add("hidden");
      this.el.classList.remove("portrait-exit");
    }, 520);
  }
}

export const portrait = new Portrait();
