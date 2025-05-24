import * as TTS from "../tts.js";

import { querySelectorOrDie } from "../utils";

export class TTSSettings extends HTMLElement {
  connectedCallback() {
    self.speechSynthesis.addEventListener(
      "voiceschanged",
      this.refresh.bind(this),
    );

    this.addEventListener("submit", this.formSubmit.bind(this));
    this.addEventListener("click", (ev) => {
      if (ev.target instanceof HTMLButtonElement && ev.target.name === "save")
        this.save();
    });

    this.refresh();
  }

  formSubmit(ev: SubmitEvent) {
    ev.preventDefault();

    const formData = this.readForm();
    if (formData) {
      const voice = self.speechSynthesis
        .getVoices()
        .find((v) => v.voiceURI === formData.voice);
      if (voice) {
        const previewText = querySelectorOrDie(
          HTMLInputElement,
          this,
          'input[name="preview"]',
        ).value;
        const utterance = new SpeechSynthesisUtterance(previewText);
        utterance.rate = formData.rate;
        utterance.voice = voice;

        self.speechSynthesis.cancel();
        self.speechSynthesis.speak(utterance);
      }
    }
  }

  save() {
    const formData = this.readForm();
    if (formData) {
      TTS.saveSettings(formData);
      window.location.hash = "";
    }
  }

  readForm(): undefined | TTS.Settings {
    const rateElem = querySelectorOrDie(
      HTMLInputElement,
      this,
      'input[name="rate"]',
    );
    const select = querySelectorOrDie(HTMLSelectElement, this, "select");

    const rate = parseFloat(rateElem.value);
    if (Number.isFinite(rate) && select.value) {
      return {
        rate,
        voice: select.value,
      };
    } else {
      return undefined;
    }
  }

  refresh() {
    const settings = TTS.loadSettings();

    const rate = settings === undefined ? 1 : settings.rate;
    const selectedVoice = settings?.voice;

    const voices = self.speechSynthesis
      .getVoices()
      .filter((v) => v.lang.startsWith("zh-"));

    const voiceChoices =
      voices.length === 0
        ? "<option disabled>No voices available</option>"
        : voices.map(
            (
              v,
            ) => `<option value="${v.voiceURI}" ${selectedVoice === v.voiceURI ? "selected" : ""}>
          ${v.name} (${v.localService ? "Local" : "Non-local"})
        </option>`,
          );

    this.innerHTML = `<form>
      <fieldset>
        <label>Voice</label>
        <select>${voiceChoices}</select>
      </fieldset>
      <fieldset>
        <label>Rate</label>
        <input name="rate" type="number" step="0.05" value="${rate}"/>
      </fieldset>
      <fieldset>
        <input placeholder="Preview text" name="preview" />
        <button>Test voice</button>
      </fieldset>
    </form>

    <button name="save">Save</button>
    <a href="#">Go Home</a>
    `;
  }
}

self.customElements.define("writing-tts-settings", TTSSettings);
