// ============================================================
// SceneManager — ① background layer + transitions
// (Fade / Camera Zoom / Light Fade / Paper Transition) so scene
// swaps are never abrupt.
// ============================================================
import { audio } from "./audio.js";

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export class SceneManager {
  constructor() {
    this.bgLayer = document.getElementById("bg-layer");
    this.overlay = document.getElementById("bg-overlay");
    this.decoLayer = document.getElementById("deco-layer");
    this.lightFlash = document.getElementById("light-flash");
    this.paperWipe = document.getElementById("paper-wipe");
    this.current = "bg-black";
  }

  setDeco(html) {
    this.decoLayer.innerHTML = html || "";
  }

  _swap(bgClass, deco) {
    this.bgLayer.className = bgClass;
    this.current = bgClass;
    if (deco !== undefined) this.setDeco(deco);
  }

  /**
   * transition: 'fade' | 'zoom' | 'light' | 'paper' | 'none'
   */
  async change(bgClass, { transition = "fade", deco = "" } = {}) {
    switch (transition) {
      case "zoom": {
        this.bgLayer.classList.add("zoom");
        await wait(500);
        this._swap(bgClass, deco);
        await wait(60);
        this.bgLayer.classList.remove("zoom");
        await wait(700);
        break;
      }
      case "light": {
        audio.divinePower();
        this.lightFlash.classList.add("flash");
        await wait(320);
        this._swap(bgClass, deco);
        await wait(600);
        this.lightFlash.classList.remove("flash");
        break;
      }
      case "paper": {
        audio.pageTurn();
        this.paperWipe.classList.add("wipe");
        await wait(500);
        this._swap(bgClass, deco);
        await wait(520);
        this.paperWipe.classList.remove("wipe");
        break;
      }
      case "none": {
        this._swap(bgClass, deco);
        break;
      }
      case "fade":
      default: {
        this.overlay.classList.add("fade-out");
        await wait(550);
        this._swap(bgClass, deco);
        await wait(550);
        this.overlay.classList.remove("fade-out");
        break;
      }
    }
  }
}

export const scene = new SceneManager();
