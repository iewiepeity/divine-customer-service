// ============================================================
// Roster — 神界部門名冊：an administrative dossier of every deity,
// paginated like ledger pages (with a paper-turn feel between pages)
// rather than an endless card-grid website. Detail cards reuse Modal.
// ============================================================
import { audio } from "./audio.js";
import { modal } from "./modal.js";
import { interpolate } from "./variables.js";

const PAGE_SIZE = 6;

export class Roster {
  constructor() {
    this.layer = document.getElementById("roster-layer");
    this.grid = document.getElementById("roster-grid");
    this.closeBtn = document.getElementById("roster-close");
    this.pagerEl = document.getElementById("roster-pager");
    this.prevBtn = document.getElementById("roster-prev");
    this.nextBtn = document.getElementById("roster-next");
    this.pageLabel = document.getElementById("roster-page-label");
    this.entries = [];
    this.page = 0;

    this.closeBtn.addEventListener("click", () => this.close());
    this.layer.addEventListener("click", (e) => {
      if (e.target === this.layer) this.close();
    });
    if (this.prevBtn) this.prevBtn.addEventListener("click", () => this._turn(-1));
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => this._turn(1));
  }

  /**
   * entries: [{ id, name, department, domain, personality, speechStyle, image }]
   */
  open(entries) {
    audio.click();
    this.entries = entries;
    this.page = 0;
    this.layer.classList.remove("hidden");
    this._render();
  }

  get pageCount() {
    return Math.max(1, Math.ceil(this.entries.length / PAGE_SIZE));
  }

  _turn(dir) {
    const next = this.page + dir;
    if (next < 0 || next >= this.pageCount) return;
    audio.pageTurn();
    this.grid.classList.add(dir > 0 ? "turn-out-left" : "turn-out-right");
    setTimeout(() => {
      this.page = next;
      this._render();
      this.grid.classList.remove("turn-out-left", "turn-out-right");
      this.grid.classList.add(dir > 0 ? "turn-in-right" : "turn-in-left");
      setTimeout(() => this.grid.classList.remove("turn-in-right", "turn-in-left"), 400);
    }, 200);
  }

  _render() {
    this.grid.innerHTML = "";
    const start = this.page * PAGE_SIZE;
    const pageEntries = this.entries.slice(start, start + PAGE_SIZE);

    pageEntries.forEach((d, i) => {
      const card = document.createElement("button");
      card.className = "roster-card";
      card.style.animationDelay = `${i * 0.05}s`;
      card.innerHTML = `
        <div class="roster-index">${String(start + i + 1).padStart(2, "0")}</div>
        <div class="roster-thumb"><div class="roster-thumb-img" style="background-image:url('${d.image}')"></div></div>
        <div class="roster-name">${interpolate(d.name)}</div>
        <div class="roster-dept">${interpolate(d.department)}</div>
        <div class="roster-duty">${interpolate(d.domain)}</div>
      `;
      card.addEventListener("mouseenter", () => audio.hover());
      card.addEventListener("click", () => {
        audio.click();
        const body =
          `部門：${d.department}\n` +
          `職掌：${d.domain}\n` +
          `性格：${d.personality}\n` +
          `說話風格：${d.speechStyle || "——"}`;
        modal.open(d.name, [body], () => {}, { image: d.image });
      });
      this.grid.appendChild(card);
    });

    if (this.pageLabel) this.pageLabel.textContent = `第 ${this.page + 1} / ${this.pageCount} 頁`;
    if (this.prevBtn) this.prevBtn.disabled = this.page === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.page >= this.pageCount - 1;
    if (this.pagerEl) this.pagerEl.classList.toggle("hidden", this.pageCount <= 1);
  }

  close() {
    audio.click();
    this.layer.classList.add("hidden");
  }
}

export const roster = new Roster();
