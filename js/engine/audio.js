// ============================================================
// AudioEngine — procedurally synthesised SFX (no binary assets needed)
// Every sound the spec calls for (Nokia ring, page turn, stamp, phone
// vibrate, click, divine power, UI hover) is generated with WebAudio so
// the whole game stays self-contained.
// ============================================================

const STORAGE_KEY = "dcsc_muted";

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem(STORAGE_KEY) === "1";
  }

  _ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem(STORAGE_KEY, this.muted ? "1" : "0");
    return this.muted;
  }

  _tone(freq, dur, { type = "sine", gain = 0.15, delay = 0, sweepTo = null } = {}) {
    if (this.muted) return;
    const ctx = this._ensureCtx();
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (sweepTo) osc.frequency.linearRampToValueAtTime(sweepTo, t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  _noise(dur, { gain = 0.12, delay = 0, filterFreq = 2000 } = {}) {
    if (this.muted) return;
    const ctx = this._ensureCtx();
    const t0 = ctx.currentTime + delay;
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = filterFreq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start(t0);
  }

  click() { this._tone(880, 0.06, { type: "square", gain: 0.07 }); }
  hover() { this._tone(1400, 0.04, { type: "sine", gain: 0.035 }); }

  pageTurn() { this._noise(0.25, { gain: 0.1, filterFreq: 3500 }); }

  stamp() {
    this._tone(90, 0.18, { type: "square", gain: 0.16 });
    this._noise(0.08, { gain: 0.13, filterFreq: 800, delay: 0.02 });
  }

  phoneRing() {
    for (let i = 0; i < 2; i++) {
      this._tone(1200, 0.18, { type: "square", gain: 0.1, delay: i * 0.24 });
      this._tone(950, 0.18, { type: "square", gain: 0.08, delay: i * 0.24 + 0.05 });
    }
  }

  vibrate() {
    for (let i = 0; i < 4; i++) {
      this._tone(120, 0.06, { type: "sawtooth", gain: 0.07, delay: i * 0.09 });
    }
  }

  divinePower() {
    this._tone(300, 1.1, { type: "sine", gain: 0.11, sweepTo: 900 });
    this._tone(600, 1.3, { type: "triangle", gain: 0.08, sweepTo: 1400, delay: 0.1 });
  }

  typeTick() { this._tone(1800, 0.02, { type: "square", gain: 0.02 }); }

  /** 玉石碰撞 — bright short glass/jade clink, used for confirmations */
  gemClink() {
    this._tone(2200, 0.12, { type: "sine", gain: 0.09 });
    this._tone(3100, 0.08, { type: "sine", gain: 0.05, delay: 0.02 });
  }

  /** 物件開啟 — soft two-note ascending chime for opening an item/card */
  itemOpen() {
    this._tone(660, 0.1, { type: "sine", gain: 0.08 });
    this._tone(990, 0.14, { type: "sine", gain: 0.08, delay: 0.07 });
  }
}

export const audio = new AudioEngine();
