// ============================================================
// SaveManager — Auto Save at the start of every Scene.
// ============================================================
const KEY = "dcsc_save_v1";

class SaveManager {
  constructor() {
    this.indicator = document.getElementById("save-indicator");
  }

  save(data) {
    const existing = this.load() || {};
    localStorage.setItem(KEY, JSON.stringify({ ...existing, ...data, savedAt: Date.now() }));
    this._flashIndicator();
  }

  load() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  clear() {
    localStorage.removeItem(KEY);
  }

  hasSave() {
    return !!localStorage.getItem(KEY);
  }

  _flashIndicator() {
    if (!this.indicator) return;
    this.indicator.classList.add("show");
    clearTimeout(this._t);
    this._t = setTimeout(() => this.indicator.classList.remove("show"), 1600);
  }
}

export const saveManager = new SaveManager();
