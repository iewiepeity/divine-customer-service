// ============================================================
// Game — orchestrator. Steps through a data-driven, modular list
// of "nodes" (dialogue / explore / choice / gallery / callRecord /
// dispatchChoice / end). Content lives entirely in js/data/*, so
// this file never hard-codes a single scene — new chapters, events
// or holidays can be added as more nodes without touching the engine.
// ============================================================
import { scene } from "./scene.js";
import { dialogueBox } from "./dialogue.js";
import { choiceUI } from "./choice.js";
import { explore } from "./explore.js";
import { gallery } from "./gallery.js";
import { recordPanel } from "./recordPanel.js";
import { modal } from "./modal.js";
import { audio } from "./audio.js";
import { saveManager } from "./save.js";
import { resultCard } from "./resultCard.js";
import { hud } from "../ui/hud.js";
import { SCROLL_ICON } from "../ui/icons.js";
import { portrait } from "./portrait.js";
import { interpolate } from "./variables.js";

const SFX = {
  phoneRing: () => audio.phoneRing(),
  vibrate: () => audio.vibrate(),
  stamp: () => audio.stamp(),
  divinePower: () => audio.divinePower(),
};

export class Game {
  constructor(nodes) {
    this.nodes = nodes;
    this.index = 0;
    this.lastSceneLabel = null;
  }

  start(fromIndex = 0) {
    this.index = fromIndex;
    this._run();
  }

  next() {
    this.index += 1;
    this._run();
  }

  _run() {
    if (this.index >= this.nodes.length) {
      this._end();
      return;
    }
    const node = this.nodes[this.index];

    if (node.scene && node.scene !== this.lastSceneLabel) {
      this.lastSceneLabel = node.scene;
      saveManager.save({ nodeIndex: this.index, sceneLabel: node.scene });
    }

    this._runNode(node);
  }

  async _runNode(node) {
    if (node.sfxOnEnter && SFX[node.sfxOnEnter]) SFX[node.sfxOnEnter]();
    if (node.hud) {
      hud.show();
      hud.update(node.hud);
    }
    if (node.portrait) {
      portrait.show(node.portrait);
    } else {
      portrait.hide();
    }

    switch (node.type) {
      case "dialogue":
        await this._doBackground(node);
        dialogueBox.play(node.lines, () => this.next());
        break;

      case "explore":
        await this._doBackground(node);
        this._withIntro(node, () => {
          dialogueBox.hide();
          explore.start(node.items, () => this.next(), { autoAdvance: node.autoAdvance });
        });
        break;

      case "gallery":
        await this._doBackground(node);
        this._withIntro(node, () => {
          dialogueBox.hide();
          // the gallery's own portrait stage takes over the spotlight —
          // step 玉皇大帝 (or whoever narrated the intro) off-screen first
          portrait.hide();
          gallery.reveal(node.chars, () => this.next(), { autoAdvance: node.autoAdvance });
        });
        break;

      case "callRecord":
        await this._doBackground(node);
        this._withIntro(node, () => {
          dialogueBox.hide();
          this._showRecordHotspot(node);
        });
        break;

      case "choice":
      case "dispatchChoice":
        await this._doBackground(node);
        this._withIntro(node, () => {
          dialogueBox.hide();
          choiceUI.show(node.prompt, node.options, (i, opt) => {
            if (opt.hud) hud.update(opt.hud);
            const proceed = () => {
              if (opt.resultCard) {
                dialogueBox.hide();
                resultCard.show(opt.resultCard, () => this.next());
              } else {
                this.next();
              }
            };
            const response = typeof opt.response === "function" ? opt.response(i) : opt.response;
            if (response && response.length) {
              dialogueBox.play(response, proceed);
            } else {
              proceed();
            }
          });
        });
        break;

      case "chapterEnd":
        await this._doBackground(node);
        dialogueBox.hide();
        this._showChapterEnd(node);
        break;

      case "cta":
        this._showCta(node);
        break;

      case "end":
        await this._doBackground(node);
        dialogueBox.play(node.lines || [], () => this._end(node));
        break;

      default:
        this.next();
    }
  }

  _withIntro(node, after) {
    if (node.introLines && node.introLines.length) {
      dialogueBox.play(node.introLines, after);
    } else {
      after();
    }
  }

  async _doBackground(node) {
    if (node.background) {
      await scene.change(node.background, { transition: node.transition || "fade", deco: node.deco });
    } else if (node.deco !== undefined) {
      scene.setDeco(node.deco);
    }
  }

  _showRecordHotspot(node) {
    const layer = document.getElementById("interaction-layer");
    layer.innerHTML = "";
    const btn = document.createElement("button");
    btn.className = "hotspot";
    btn.style.left = (node.hotspot?.x ?? 50) + "%";
    btn.style.top = (node.hotspot?.y ?? 55) + "%";
    btn.innerHTML =
      `<div class="icon has-image" style="background-image:url('${SCROLL_ICON}')"></div>` +
      `<div class="label">${node.hotspot?.label ?? "卷宗"}</div>`;
    btn.addEventListener("click", () => {
      recordPanel.open(node.title, node.fields, () => this.next());
    });
    layer.appendChild(btn);
  }

  _end(node) {
    modal.open(
      (node && node.endTitle) || "本章結束",
      [(node && node.endText) || "……待續。"],
      () => {}
    );
  }

  _showChapterEnd(node) {
    hud.hide();
    const el = document.getElementById("chapter-end");
    const titleEl = document.getElementById("chapter-end-title");
    titleEl.textContent = interpolate((node && node.title) || "第一章・完");
    el.classList.remove("hidden");
    requestAnimationFrame(() => el.classList.add("show"));
    audio.stamp();
    const onClick = () => {
      el.removeEventListener("click", onClick);
      el.classList.remove("show");
      setTimeout(() => {
        el.classList.add("hidden");
        this.next();
      }, 400);
    };
    el.addEventListener("click", onClick);
  }

  _showCta() {
    const el = document.getElementById("cta-screen");
    el.classList.remove("hidden");
    requestAnimationFrame(() => el.classList.add("show"));
  }
}
