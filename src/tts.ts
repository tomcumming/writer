const TTS_KEY = "tts-settings";

export type Settings = {
  /** voice URI */
  voice: string;
  rate: number;
};

export function loadSettings(): undefined | Settings {
  const json = self.localStorage.getItem(TTS_KEY);
  return json === null ? undefined : JSON.parse(json);
}

export function saveSettings(settings: Settings) {
  self.localStorage.setItem(TTS_KEY, JSON.stringify(settings));
}

let memoVoice: undefined | SpeechSynthesisVoice;

export function utterance(txt: string): SpeechSynthesisUtterance {
  const settings = loadSettings();
  if (settings === undefined) throw new Error(`TTS settings unset`);

  if (memoVoice === undefined || memoVoice.voiceURI !== settings.voice) {
    memoVoice = self.speechSynthesis
      .getVoices()
      .find((v) => v.voiceURI === settings.voice);
    if (memoVoice === undefined)
      throw new Error(`Could not find voice '${settings.voice}'`);
  }

  const u = new SpeechSynthesisUtterance(txt);
  u.rate = settings.rate;
  u.voice = memoVoice;
  return u;
}
