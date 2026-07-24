// ============================================================
// Roster — 神界部門名冊：a browsable grid of deity cards, reusing
// Modal for the detail popup. Independent of the main script, so it
// can be reached from the title screen (or later, an in-game menu)
// without touching the linear opening flow.
// ============================================================
import { audio } from "./audio.js";
import { modal } from "./modal.js";

export class Roster {
  constructor() {
    this.layer = document.getElementById("roster-layer");
    this.grid = document.getElementById("roster-grid");
    this.closeBtn = document.getElementById("roster-close");
    this.closeBtn.addEventListener("click", () => this.close());
    this.layer.addEventListener("click", (e) => {
      if (e.target === this.layer) this.close();
    });
  }

  /**
   * entries: [{ id, name, department, domain, personality, image }]
   */
  open(entries) {
    audio.click();
    this.grid.innerHTML = "";
    entries.forEach((d) => {
      const card = document.createElement("button");
      card.className = "roster-card";
      card.innerHTML = `
        <div class="roster-thumb" style="background-image:url('${d.image}')"></div>
        <div class="roster-name">${d.name}</div>
        <div class="roster-dept">${d.department}</div>
      `;
      card.addEventListener("mouseenter", () => audio.hover());
      card.addEventListener("click", () => {
        audio.click();
        const body = `部門：${d.department}\n職掌：${d.domain}\n性格：${d.personality}`;
        modal.open(d.name, [body], () => {}, { image: d.image });
      });
      this.grid.appendChild(card);
    });
    this.layer.classList.remove("hidden");
  }

  close() {
    audio.click();
    this.layer.classList.add("hidden");
  }
}

export const roster = new Roster();
