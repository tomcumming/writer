import { downloadEntries } from "../cedict";
import * as DB from "../db.js";
import { querySelectorOrDie } from "../utils";

export class App extends HTMLElement {
  super() {}

  connectedCallback() {
    window.addEventListener("hashchange", this.refresh.bind(this));

    this.refresh();
  }

  disconnectedCallback() {
    // TODO remove event listeners
  }

  refresh() {
    const hash = window.location.hash;
    if (/^#?$/.test(hash)) {
      this.renderRoot();
    } else if (hash === "#import-cedict") {
      this.renderImportCEdict();
    } else if (hash === "#writing") {
      this.renderWriting();
    } else if (hash === "#tts") {
      this.renderTts();
    } else {
      console.error(`Unknown route`, hash);
    }
  }

  renderRoot() {
    this.innerHTML = `<h1>Root</h1>`;
  }

  renderWriting() {
    this.innerHTML = "<writing-writing />";
  }

  renderTts() {
    this.innerHTML = `<writing-tts-settings />`;
  }

  renderImportCEdict() {
    this.innerHTML = `
  <h1>Import cedict</h1>
  <input type="url" id="cedict-url" value="https://tomcumming.github.io/writer/data/cedict_1_0_ts_utf-8_mdbg.txt" >
  <button id="cedict-import-button">Import</button>
  <p id="cedict-import-result"></p>
  <a href="/">Go home</a>
`;

    const input = querySelectorOrDie(HTMLInputElement, this, "#cedict-url");
    const button = querySelectorOrDie(
      HTMLButtonElement,
      this,
      "#cedict-import-button",
    );
    const result = querySelectorOrDie(
      HTMLElement,
      this,
      "#cedict-import-result",
    );

    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        result.innerText = "Downloading...";
        const entries = await downloadEntries(input.value);
        result.innerText = "Importing...";
        await new Promise((res) => window.requestAnimationFrame(res));
        const db = await DB.openDb();
        DB.writeEntries(db, entries);
        result.innerText = "Import successful";
      } catch (e) {
        console.error(e);
        result.innerText = `Failed to import dictionary`;
      }
    });
  }
}

self.customElements.define("writer-app", App);
