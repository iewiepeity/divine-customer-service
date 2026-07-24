// ============================================================
// SceneManager — ① background layer + transitions
// (Fade / Camera Zoom / Light Flash / Paper Wipe / Cloud Fade /
// Gold Particle Dissolve) so scene swaps are never abrupt.
// Respects prefers-reduced-motion by collapsing to a quick fade.
// ============================================================
import { audio } from "./audio.js";

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export class SceneManager {
  constructor() {
    this.bgLayer = document.getElementById("bg-layer");
    this.overlay = document.getElementById("bg-overlay");
    this.decoLayer = document.getElementById("deco-layer");
    this.lightFlash = document.getElementById("light-flash");
    this.paperWipe = document.getElementById("paper-wipe");
    this.cloudFade = document.getElementById("cloud-fade");
    this.particleDissolve = document.getElementById("particle-dissolve");
    this.current = "bg-black";
    this._lastDeco = "";
  }

  setDeco(html) {
    const next = html || "";
    // Skip the DOM rewrite when the deco is unchanged (e.g. the same
    // standing characters carry across consecutive nodes) so their
    // entrance animations don't keep re-triggering on every node change.
    if (this._lastDeco === next) return;
    this._lastDeco = next;
    this.decoLayer.innerHTML = next;
  }

  _swap(bgClass, deco) {
    this.bgLayer.className = bgClass;
    this.current = bgClass;
    if (deco !== undefined) this.setDeco(deco);
  }

  /**
   * transition: 'fade' | 'zoom' | 'light' | 'paper' | 'cloud' | 'particle' | 'whiteout' | 'none'
   */
  async change(bgClass, { transition = "fade", deco = "" } = {}) {
    if (prefersReducedMotion() && transition !== "none") {
      const overlayClass = transition === "whiteout" ? "fade-out-white" : "fade-out";
      this.overlay.classList.add(overlayClass);
      await wait(120);
      this._swap(bgClass, deco);
      if (transition !== "whiteout") {
        await wait(120);
        this.overlay.classList.remove(overlayClass);
      }
      return;
    }

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
      case "cloud": {
        audio.pageTurn();
        this.cloudFade.classList.add("active");
        await wait(420);
        this._swap(bgClass, deco);
        await wait(480);
        this.cloudFade.classList.remove("active");
        break;
      }
      case "particle": {
        audio.divinePower();
        this.particleDissolve.classList.add("active");
        await wait(380);
        this._swap(bgClass, deco);
        await wait(520);
        this.particleDissolve.classList.remove("active");
        break;
      }
      case "whiteout": {
        this.overlay.classList.add("fade-out-white");
        await wait(1400);
        this._swap(bgClass, deco);
        // deliberately left white — this is the final beat of the chapter
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
