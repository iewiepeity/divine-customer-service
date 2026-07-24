// ============================================================
// ExploreLayer — ③ Interaction Layer, "Explore Mode"
// Player freely clicks objects, no time limit. Visited objects dim.
// Once everything is visited, a Continue control appears / scene
// auto-advances.
// ============================================================
import { audio } from "./audio.js";
import { modal } from "./modal.js";

export class ExploreLayer {
  constructor() {
    this.layer = document.getElementById("interaction-layer");
    this.items = [];
    this.visited = new Set();
    this.onComplete = null;
    this.autoAdvance = false;
  }

  /**
   * items: [{ id, icon, image, label, x, y, title, pages }]  x/y in % of screen
   * opts.autoAdvance: skip the Continue button and call onComplete immediately
   *   once everything has been viewed
   * opts.continueLabel: text for the continue button
   */
  start(items, onComplete, opts = {}) {
    this.items = items;
    this.visited = new Set();
    this.onComplete = onComplete;
    this.autoAdvance = !!opts.autoAdvance;
    this.layer.innerHTML = "";

    const badge = document.createElement("div");
    badge.className = "progress-badge";
    badge.id = "explore-progress";
    badge.textContent = `查看物件 0 / ${items.length}`;
    this.layer.appendChild(badge);

    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.className = "hotspot";
      btn.style.left = item.x + "%";
      btn.style.top = item.y + "%";
      const icon = document.createElement("div");
      icon.className = "icon";
      if (item.image) {
        icon.classList.add("has-image");
        icon.style.backgroundImage = `url("${item.image}")`;
      } else {
        icon.textContent = item.icon || "";
      }
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = item.label;
      btn.appendChild(icon);
      btn.appendChild(label);
      btn.addEventListener("mouseenter", () => audio.hover());
      btn.addEventListener("click", () => this._inspect(item, btn));
      this.layer.appendChild(btn);
    });

    if (!this.autoAdvance) {
      const cont = document.createElement("button");
      cont.id = "explore-continue";
      cont.textContent = "繼續";
      cont.addEventListener("click", () => {
        audio.click();
        this.clear();
        if (this.onComplete) this.onComplete();
      });
      this.layer.appendChild(cont);
    }
  }

  _inspect(item, btn) {
    audio.click();
    const pages = typeof item.pages === "function" ? item.pages() : item.pages;
    modal.open(
      item.title,
      pages,
      () => {
        this.visited.add(item.id);
        btn.classList.add("visited");
        const badge = document.getElementById("explore-progress");
        if (badge) badge.textContent = `查看物件 ${this.visited.size} / ${this.items.length}`;
        if (this.visited.size >= this.items.length) {
          if (this.autoAdvance) {
            this.clear();
            if (this.onComplete) this.onComplete();
          } else {
            const cont = document.getElementById("explore-continue");
            if (cont) cont.classList.add("show");
          }
        }
      },
      { image: item.image }
    );
  }

  clear() {
    this.layer.innerHTML = "";
  }
}

export const explore = new ExploreLayer();
