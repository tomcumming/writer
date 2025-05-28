import * as WI from "../db/word-index.js";
import * as TTS from "../tts.js";
import { querySelectorOrDie } from "../utils";
import { ReadAlong } from "../components/read-along.js";

export class Writing extends HTMLElement {
  connectedCallback() {
    // TODO store selection again to deal with safari mobile click event
    // clearing it

    this.addEventListener("click", (ev) => {
      if (ev.target instanceof HTMLButtonElement && ev.target.name === "speak")
        this.speak();
    });

    this.refresh();
  }

  async refresh() {
    this.innerHTML = `
    <read-along text-content="自2006年以来，丹麦已将法定退休年龄与预期寿命挂勾，并且每五年进行一次调整。目前的退休年龄为67岁，将于2030年提高至68岁，并于2035年提高至69岁。"></read-along>
    <div class="text-input">
      <button>⌫</button>
      <input type="text">
      <button name="speak">🗣️</button>
    </div>
    <div class="stroke-orders">
    </div>
    <ul class="definitions">
    </ul>
    `;

    const input = querySelectorOrDie(HTMLInputElement, this, "input");
    input.addEventListener("input", (ev) => {
      if (!(ev as any).isComposing) this.enqueueTextChange(input.value);
    });
    input.addEventListener("compositionend", () =>
      this.enqueueTextChange(input.value),
    );
  }

  private inflightTextChanges: string[] = [];
  private textChangeTask?: Promise<void>;

  enqueueTextChange(text: string) {
    this.inflightTextChanges.push(text);
    if (this.textChangeTask === undefined)
      this.textChangeTask = this.performTextChange();
  }

  speak() {
    if (self.speechSynthesis.pending || self.speechSynthesis.speaking) {
      self.speechSynthesis.cancel();
      return;
    }

    const readAlong = querySelectorOrDie(ReadAlong, this, "read-along");

    const originalSelection = self.getSelection();
    let selectionRange = defaultSpeechRange(readAlong);
    if (originalSelection && originalSelection.rangeCount > 0) {
      const range = originalSelection.getRangeAt(0);
      if (readAlong.getSelectionOffset(range) !== undefined)
        selectionRange = range;
    }

    const startOffset = readAlong.getSelectionOffset(selectionRange);
    if (startOffset === undefined) {
      debugger;
      throw new Error(`Can't get offset from ReadAlong`);
    }

    const selectedText = selectionRange.toString();

    const utterance = TTS.utterance(selectedText);
    utterance.addEventListener("boundary", (ev) => {
      const start = startOffset + ev.charIndex;
      readAlong.setAttribute("range-start", String(startOffset + ev.charIndex));
      readAlong.setAttribute("range-end", String(start + ev.charLength - 1));
    });
    utterance.addEventListener("end", () => {
      readAlong.removeAttribute("range-start");
      readAlong.removeAttribute("range-end");
    });
    self.speechSynthesis.speak(utterance);
  }

  async performTextChange() {
    const output = querySelectorOrDie(HTMLUListElement, this, "ul");
    const db = await WI.openDb();

    while (this.inflightTextChanges.length > 0) {
      const text =
        this.inflightTextChanges[this.inflightTextChanges.length - 1];
      this.inflightTextChanges = [];

      output.innerHTML = "";

      const handled = new Set();
      let currentSearch = text;
      while (currentSearch.length > 0) {
        // TODO order by length reversing, treat subsequents as 'secondary'
        let words = Array.from(await WI.searchPrefixes(db, currentSearch));
        for (const word of words) {
          if (!handled.has(word)) {
            handled.add(word);
            const child = document.createElement("li");
            child.innerText = word;
            output.appendChild(child);
          }
        }
        currentSearch = currentSearch.substring(1);
      }
    }
    this.textChangeTask = undefined;
  }
}

function defaultSpeechRange(elem: ReadAlong) {
  // TODO we will select the last phrase

  const range = new Range();
  range.setStart(elem.children[0], 0);
  const last = elem.children[elem.children.length - 1];
  range.setEnd(last, elementTextLength(last)); // TODO get length etc
  return range;
}

function elementTextLength(elem: Element): number {
  if (elem.childNodes.length === 1 && elem.firstChild instanceof Text)
    return elem.firstChild.data.length;
  else return 0;
}

self.customElements.define("writing-writing", Writing);
