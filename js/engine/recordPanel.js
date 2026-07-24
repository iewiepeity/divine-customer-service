// ============================================================
// RecordPanel — the giant 卷宗 (case scroll), revealed one field
// at a time (rather than dumped all at once) to keep a reading
// rhythm, per spec.
// ============================================================
import { audio } from "./audio.js";
import { interpolate } from "./variables.js";

export class RecordPanel {
  constructor() {
    this.layer = document.getElementById("interaction-layer");
  }

  /**
   * title: string
   * fields: [{label, value}]
   */
  open(title, fields, onComplete) {
    this.layer.innerHTML = "";
    const panel = document.createElement("div");
    panel.id = "record-panel";
    panel.innerHTML = `
      <h3>${interpolate(title)}</h3>
      <div id="record-fields"></div>
      <button id="record-next">翻開卷宗</button>
    `;
    this.layer.appendChild(panel);

    const fieldsEl = panel.querySelector("#record-fields");
    const btn = panel.querySelector("#record-next");
    let i = 0;

    const revealNext = () => {
      if (i < fields.length) {
        const f = fields[i];
        audio.pageTurn();
        const row = document.createElement("div");
        row.className = "record-field";
        row.innerHTML =
          `<span class="key">${interpolate(f.label)}</span>` +
          `<span class="val">${interpolate(f.value)}</span>`;
        fieldsEl.appendChild(row);
        setTimeout(() => audio.stamp(), 260);
        i += 1;
        btn.textContent = i >= fields.length ? "闔上卷宗" : "翻下一頁";
        fieldsEl.scrollTop = fieldsEl.scrollHeight;
      } else {
        this.layer.innerHTML = "";
        if (onComplete) onComplete();
      }
    };

    btn.addEventListener("click", revealNext);
  }
}

export const recordPanel = new RecordPanel();
