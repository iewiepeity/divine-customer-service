// ============================================================
// Typewriter — renders text at 40~60ms/char, click reveals full text.
// ============================================================
import { audio } from "./audio.js";

export function typewrite(el, text, { minMs = 40, maxMs = 60, onDone = () => {} } = {}) {
  let cancelled = false;
  let done = false;
  let timer = null;
  el.textContent = "";

  function finish() {
    if (done) return;
    clearTimeout(timer);
    done = true;
    el.textContent = text;
    onDone();
  }

  function step(i) {
    if (cancelled) return;
    if (i >= text.length) {
      finish();
      return;
    }
    el.textContent = text.slice(0, i + 1);
    if (i % 3 === 0) audio.typeTick();
    const delay = minMs + Math.random() * (maxMs - minMs);
    timer = setTimeout(() => step(i + 1), delay);
  }

  step(0);

  return {
    get isDone() { return done; },
    skip: finish,
    cancel() { cancelled = true; clearTimeout(timer); },
  };
}
