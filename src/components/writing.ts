import * as DB from "../db.js";
import { querySelectorOrDie } from "../utils";

export class Writing extends HTMLElement {
  connectedCallback() {
    this.refresh();
  }

  async refresh() {
    this.innerHTML = `
  <input type="text">
  <ul>
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

  async performTextChange() {
    const output = querySelectorOrDie(HTMLUListElement, this, "ul");
    const db = await DB.openDb();

    while (this.inflightTextChanges.length > 0) {
      const text =
        this.inflightTextChanges[this.inflightTextChanges.length - 1];
      this.inflightTextChanges = [];

      output.innerHTML = "";

      const handled = new Set();
      let currentSearch = text;
      while (currentSearch.length > 0) {
        // TODO order by length reversing, treat subsequents as 'secondary'
        let words = Array.from(await DB.searchPrefixes(db, currentSearch));
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

self.customElements.define("writing-writing", Writing);
