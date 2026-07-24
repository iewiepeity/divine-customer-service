// ============================================================
// RecordPanel — the giant 卷宗 (case scroll). Never opens blank:
// cover appears first, then auto-unfurls into the first page, then
// fields are typed out one at a time (typewriter + stamp + page-turn),
// each field revealed only after the previous one finished.
// ============================================================
import { audio } from "./audio.js";
import { interpolate } from "./variables.js";
import { typewrite } from "./typewriter.js";

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
      <div id="record-cover">
        <div class="record-cover-seal">機密</div>
        <div class="record-cover-title">卷宗</div>
        <div class="record-cover-hint">正在開啟……</div>
      </div>
      <div id="record-content" class="hidden">
        <h3>${interpolate(title)}</h3>
        <div id="record-fields"></div>
        <button id="record-next" disabled>翻下一頁</button>
      </div>
    `;
    this.layer.appendChild(panel);

    const cover = panel.querySelector("#record-cover");
    const content = panel.querySelector("#record-content");
    const fieldsEl = panel.querySelector("#record-fields");
    const btn = panel.querySelector("#record-next");

    let i = 0;
    let activeType = null;

    const addField = () => {
      audio.pageTurn();
      const f = fields[i];
      const row = document.createElement("div");
      row.className = "record-field";
      row.innerHTML = `<span class="key">${interpolate(f.label)}</span><span class="val"></span>`;
      fieldsEl.appendChild(row);
      fieldsEl.scrollTop = fieldsEl.scrollHeight;
      const valEl = row.querySelector(".val");
      btn.disabled = true;
      activeType = typewrite(valEl, interpolate(f.value), {
        onDone: () => {
          activeType = null;
          audio.stamp();
          btn.disabled = false;
          i += 1;
          btn.textContent = i >= fields.length ? "闔上卷宗" : "翻下一頁";
        },
      });
    };

    btn.addEventListener("click", () => {
      if (activeType && !activeType.isDone) {
        activeType.skip();
        return;
      }
      if (i < fields.length) {
        addField();
      } else {
        this.layer.innerHTML = "";
        if (onComplete) onComplete();
      }
    });

    // Cover → unfurl → first field, all automatic — the player must
    // never see an empty record, so nothing here waits on a click.
    setTimeout(() => {
      cover.classList.add("opening");
      audio.pageTurn();
      setTimeout(() => {
        cover.remove();
        content.classList.remove("hidden");
        content.classList.add("unfurl-in");
        addField();
      }, 420);
    }, 550);
  }
}

export const recordPanel = new RecordPanel();
