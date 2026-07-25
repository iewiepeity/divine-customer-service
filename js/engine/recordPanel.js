// ============================================================
// RecordPanel — the 卷宗 (case tome). Never opens blank: the closed
// volume is shown first, it swings open onto the official art, then the
// fields are typed onto the page one at a time (typewriter + stamp +
// page-turn), each waiting for the previous one to finish.
//
// The page art carries its own printed sample entries, so the field area
// is washed back to bare paper before this writes the player's own
// record over it — the binding, tabs and page edges stay visible.
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
    const wrap = document.createElement("div");
    wrap.id = "record-wrap";
    wrap.innerHTML = `
      <div id="record-panel">
        <div id="record-page">
          <h3>${interpolate(title)}</h3>
          <div id="record-fields"></div>
        </div>
        <div id="record-cover"></div>
      </div>
      <button id="record-next" disabled>翻下一頁</button>
    `;
    this.layer.appendChild(wrap);

    const panel = wrap.querySelector("#record-panel");
    const cover = wrap.querySelector("#record-cover");
    const page = wrap.querySelector("#record-page");
    const fieldsEl = wrap.querySelector("#record-fields");
    const btn = wrap.querySelector("#record-next");

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
          row.classList.add("stamped");
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

    // Closed volume → opens → first entry, all automatic. The player must
    // never be looking at an empty record.
    setTimeout(() => {
      audio.pageTurn();
      cover.classList.add("opening");
      panel.classList.add("opened");
      setTimeout(() => {
        cover.remove();
        page.classList.add("show");
        addField();
      }, 620);
    }, 620);
  }
}

export const recordPanel = new RecordPanel();
