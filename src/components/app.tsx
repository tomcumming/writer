import { useEffect, useState } from "preact/hooks";
import { downloadEntries } from "../cedict.js";
import * as WI from "../db/word-index.js";
import { createElement } from "preact";

import Writing from "./writing";

function useHash(): string {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = (_e: HashChangeEvent) => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  });

  return hash;
}

export default function App() {
  const hash = useHash();

  if (/^#?$/.test(hash)) {
    return (
      <>
        <h1>Root</h1>
        <p>
          <a href="#tts">TTS Config</a>
        </p>
        <p>
          <a href="#import-cedict">Import CEdict</a>
        </p>
        <p>
          <a href="#writing">Writing</a>
        </p>
      </>
    );
  } else if (hash === "#import-cedict") {
    return <ImportCEdict />;
  } else if (hash === "#writing") {
    return <Writing />;
  } else if (hash === "#tts") {
    return createElement("writing-tts-settings", {});
  } else {
    throw new Error(`Unknown route: '${hash}'`);
  }
}

function ImportCEdict() {
  const [url, setUrl] = useState(
    "https://tomcumming.github.io/writer/data/cedict_1_0_ts_utf-8_mdbg.txt",
  );
  const [result, setResult] = useState("");

  const onClick = async () => {
    setResult("Downloading...");
    try {
      const entries = await downloadEntries(url);
      setResult("Importing...");
      await new Promise((res) => window.requestAnimationFrame(res));
      const db = await WI.openDb();
      WI.writeEntries(db, entries);
      setResult("Import successful");
    } catch (e) {
      console.error(e);
      setResult(`Failed to import dictionary`);
    }
  };
  return (
    <>
      <h1>Import cedict</h1>
      <input
        type="url"
        id="cedict-url"
        value={url}
        onInput={(e) => setUrl(e.currentTarget.value)}
      />
      <button
        id="cedict-import-button"
        disabled={result !== ""}
        onClick={onClick}
      >
        Import
      </button>
      <p id="cedict-import-result">{result}</p>
      <a href="#">Go home</a>
    </>
  );
}
