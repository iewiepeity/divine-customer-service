// ============================================================
// ResultCard — 案件處理回報單, shown after a dispatch decision so the
// player's choice visibly leaves a record. Content is entirely
// data-driven (see js/data/script.js), never hard-coded per scene.
// ============================================================
import { audio } from "./audio.js";
import { interpolate } from "./variables.js";

export class ResultCard {
  constructor() {
    this.layer = document.getElementById("result-layer");
    this.caseNoEl = document.getElementById("result-case-no");
    this.fieldsEl = document.getElementById("result-fields");
    this.closeBtn = document.getElementById("result-close");
    this.onCloseCb = null;
    this.closeBtn.addEventListener("click", () => this.close());
  }

  /**
   * data: { caseNo, fields: [{label, value}], closeLabel }
   */
  show(data, onClose) {
    audio.pageTurn();
    this.caseNoEl.textContent = interpolate(data.caseNo || "");
    this.fieldsEl.innerHTML = "";
    (data.fields || []).forEach((f, i) => {
      const row = document.createElement("div");
      row.className = "result-field";
      row.style.animationDelay = `${0.15 + i * 0.09}s`;
      row.innerHTML =
        `<span class="result-key">${interpolate(f.label)}</span>` +
        `<span class="result-val">${interpolate(f.value)}</span>`;
      this.fieldsEl.appendChild(row);
    });
    this.closeBtn.textContent = data.closeLabel || "結案歸檔";
    this.onCloseCb = onClose || null;
    this.layer.classList.remove("hidden");
    setTimeout(() => audio.stamp(), 380);
  }

  close() {
    audio.gemClink();
    this.layer.classList.add("hidden");
    const cb = this.onCloseCb;
    this.onCloseCb = null;
    if (cb) cb();
  }
}

export const resultCard = new ResultCard();
