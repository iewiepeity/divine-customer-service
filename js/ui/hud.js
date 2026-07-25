// ============================================================
// HUD — persistent glass status bar (date/time, location, pending
// case count, spirit status). Hidden through the death/explore/
// introduction beats; a scene node opts in by carrying a `hud` field,
// at which point it fades in and stays visible. Later nodes/choice
// options can patch it via hud.update(partial) so the bar reflects
// dispatch decisions without a full re-render.
// ============================================================
import { interpolate } from "../engine/variables.js";

export class Hud {
  constructor() {
    this.el = document.getElementById("hud-status");
    this.datetimeEl = document.getElementById("hud-datetime");
    this.locationEl = document.getElementById("hud-location");
    this.pendingEl = document.getElementById("hud-pending");
    this.spiritsEl = document.getElementById("hud-spirits");
    this.toggleBtn = document.getElementById("hud-toggle");
    this.state = null;
    this.visible = false;

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => {
        this.el.classList.toggle("expanded");
      });
    }
  }

  show() {
    if (!this.el || this.visible) return;
    this.visible = true;
    this.el.classList.remove("hidden");
    requestAnimationFrame(() => this.el.classList.add("show"));
  }

  hide() {
    if (!this.el || !this.visible) return;
    this.visible = false;
    this.el.classList.remove("show");
    setTimeout(() => this.el.classList.add("hidden"), 720);
  }

  /** Immediate teardown for a replay — no fade, and the counters are
   *  dropped so the next run doesn't inherit the previous one's state. */
  reset() {
    if (!this.el) return;
    this.visible = false;
    this.state = null;
    this.el.classList.remove("show");
    this.el.classList.add("hidden");
  }

  update(partial) {
    if (!partial) return;
    this.state = { ...(this.state || {}), ...partial };
    this._render();
  }

  _render() {
    const s = this.state;
    if (!s) return;
    if (this.datetimeEl && s.datetime) this.datetimeEl.textContent = interpolate(s.datetime);
    if (this.locationEl && s.location) this.locationEl.textContent = interpolate(s.location);
    if (this.pendingEl && typeof s.pending === "number") {
      this.pendingEl.textContent = `待辦案件：${s.pending} 件`;
    }
    if (this.spiritsEl && s.spirits) {
      this.spiritsEl.innerHTML = "";
      s.spirits.forEach((sp) => {
        const row = document.createElement("div");
        row.className = "hud-spirit";
        row.innerHTML =
          `<span class="hud-dot" data-status="${sp.busy ? "busy" : "idle"}"></span>` +
          `<span class="hud-spirit-name">${sp.name}</span>` +
          `<span class="hud-spirit-status">${interpolate(sp.status)}</span>`;
        this.spiritsEl.appendChild(row);
      });
    }
  }
}

export const hud = new Hud();
