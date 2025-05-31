import { useRef, useState } from "preact/hooks";
import * as WI from "../db/word-index";
import * as WS from "../db/writing-state";
import * as TTS from "../tts";
import { ReadAlong, readAlongSelection } from "./read-along";
import { Component, JSX } from "preact";

export default function Writing() {
  const readAlongRef = useRef<Component>(null);
  const [highlighted, setHighlighted] = useState<
    undefined | { start: number; length: number }
  >(undefined);
  const [ws, setWs] = useWritingState();
  const onBackSpace = () =>
    setWs({
      ...ws,
      previousText: ws.previousText.slice(0, ws.previousText.length - 1),
    });

  const onClickSpeak = () => {
    const selected =
      readAlongRef.current?.base instanceof HTMLElement
        ? readAlongSelection(readAlongRef.current.base)
        : undefined;
    doSpeak(setHighlighted, selected, ws.previousText);
  };

  return (
    <div class="writing">
      <ReadAlong
        text={ws.previousText}
        highlight={highlighted}
        ref={readAlongRef}
      />
      <div class="text-input">
        <button name="back-space" onClick={onBackSpace}>
          ⌫
        </button>
        <input type="text" onInput={doChangeText(ws, setWs)} />
        <button name="speak" onClick={onClickSpeak}>
          🗣️
        </button>
      </div>
      <div class="stroke-orders"></div>
      <ul class="definitions"></ul>
    </div>
  );
}

const MAX_PREVIOUS_LENGTH = 500;

function doChangeText(
  ws: WS.State,
  setWs: (s: WS.State) => void,
): JSX.InputEventHandler<HTMLInputElement> {
  return function (ev) {
    if (!ev.isComposing || ev.inputType === "insertFromComposition") {
      const input = ev.currentTarget;
      const newText = ws.previousText + input.value;
      setWs({
        ...ws,
        previousText: newText.slice(
          Math.max(0, newText.length - MAX_PREVIOUS_LENGTH),
        ),
      });
      input.value = "";
    }
  };
}

function doSpeak(
  setHighlight: (selected?: { start: number; length: number }) => void,
  userSelected: undefined | { start: number; length: number },
  allText: string,
) {
  if (self.speechSynthesis.speaking) {
    self.speechSynthesis.cancel();
    return;
  }

  const selected = userSelected ? userSelected : defaultSpeechRange(allText);

  const text = allText.substring(
    selected.start,
    selected.start + selected.length,
  );

  const utterance = TTS.utterance(text);

  utterance.addEventListener("boundary", (ev) =>
    setHighlight({
      start: selected.start + ev.charIndex,
      length: ev.charLength,
    }),
  );
  utterance.addEventListener("end", (_ev) => setHighlight(undefined));

  self.speechSynthesis.speak(utterance);
}

function* speechRanges(
  allText: string,
): Generator<{ start: number; charCount: number }> {
  const chars = Array.from(allText);
  let charCount = 0;
  let start = chars.length - 1;
  let readChar = false;
  while (start >= 0) {
    if (/\p{Script=Han}/u.test(chars[start])) {
      readChar = true;
      charCount += 1;
    } else if (!/\w/.test(chars[start])) {
      if (readChar) {
        yield { start: start + 1, charCount };
        readChar = false;
      }
    }

    start -= 1;
  }

  if (readChar) yield { start: start + 1, charCount };
}

function defaultSpeechRange(allText: string): {
  start: number;
  length: number;
} {
  let best: undefined | { start: number; charCount: number };
  for (const entry of speechRanges(allText)) {
    if (best === undefined || entry.charCount <= 5) best = entry;
    else break;
  }

  return best
    ? { start: best.start, length: allText.length - best.start }
    : { start: 0, length: allText.length };
}

function useWritingState(): [WS.State, (s: WS.State) => void] {
  const [s, ss] = useState(WS.load());
  return [
    s,
    (s2) => {
      WS.save(s2);
      ss(s2);
    },
  ];
}
