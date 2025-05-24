import * as WI from "../db/word-index.js";
import * as TTS from "../tts.js";
import { querySelectorOrDie } from "../utils";

export class Writing extends HTMLElement {
  connectedCallback() {
    // TODO remove!
    document.addEventListener(
      "selectionchange",
      this.onSelectionChange.bind(this),
    );

    this.addEventListener("click", (ev) => {
      if (ev.target instanceof HTMLButtonElement && ev.target.name === "speak")
        this.speak();
    });

    this.refresh();
  }

  async refresh() {
    this.innerHTML = `
    <div class="previous">
      <div>
        <span class="text">自2006年以来，丹麦已将法定退休年龄与预期寿命挂勾，并且每五年进行一次调整。目前的退休年龄为67岁，将于2030年提高至68岁，并于2035年提高至69岁。</span>
        <button name="speak">🗣️</button>
      </div>
    </div>
    <div class="text-input">
      <button>⌫</button>
      <input type="text">
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

  // We store the selection because safari will clear it on button click!
  private selectionRange: undefined | Range;

  onSelectionChange() {
    const selection = self.getSelection();
    const range =
      selection && selection?.rangeCount > 0 && selection.anchorNode
        ? selection.getRangeAt(0)
        : undefined;
    this.selectionRange =
      range && range.startOffset < range.endOffset ? range : undefined;
  }

  speak() {
    if (self.speechSynthesis.pending || self.speechSynthesis.speaking) {
      self.speechSynthesis.cancel();
      return;
    }

    const textElem = querySelectorOrDie(
      HTMLElement,
      this,
      ".previous > div > .text",
    );
    const textNode = textElem.childNodes[0] as Text;

    const originalSelectionRange = this.selectionRange;
    const selectionRange =
      originalSelectionRange || defaultSpeechRange(textNode);
    const selectedText = textNode.data.substring(
      selectionRange.startOffset,
      selectionRange.endOffset,
    );

    const utterance = TTS.utterance(selectedText);
    utterance.addEventListener("boundary", (ev) => {
      const range = new Range();
      range.setStart(textNode, selectionRange.startOffset + ev.charIndex);
      range.setEnd(
        textNode,
        selectionRange.startOffset + ev.charIndex + ev.charLength,
      );
      const selection = self.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    });
    utterance.addEventListener("end", () => {
      const selection = self.getSelection();
      if (originalSelectionRange) {
        selection?.removeAllRanges();
        selection?.addRange(originalSelectionRange);
      } else {
        selection?.removeAllRanges();
      }
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

function defaultSpeechRange(textNode: Text) {
  // TODO we will select the last phrase

  const range = new Range();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.data.length);
  return range;
}

self.customElements.define("writing-writing", Writing);
