// const DATA_URI = `https://tomcumming.github.io/writer/data/cedict_1_0_ts_utf-8_mdbg.txt`;
const DATA_URI = `/data/cedict_1_0_ts_utf-8_mdbg.txt`;

export type CEdictEntry = {
  simp: string;
  trad: string;
  pinyin: string;
  eng: string[];
};

export async function downloadEntries(): Promise<CEdictEntry[]> {
  const rawText = await fetch(DATA_URI).then((res) => res.text());

  return rawText
    .split("\n")
    .filter((l) => !l.startsWith("#"))
    .map(parseLine);
}

function parseLine(line: string): CEdictEntry {
  const match = /^(\S+)\s(\S+)\s\[([^\]]+)\]\s\/(.+)\/$/m.exec(line);
  if (!match) {
    console.error(`Failed to read: '${line}'`);
    throw new Error("Parsing failed");
  }

  return {
    trad: match[1],
    simp: match[2],
    pinyin: match[3],
    eng: match[4].split("/").flatMap((e) => e.split(";")),
  };
}

export function orderEntries(engs: string[]): string[] {
  function score(entry: string): number {
    return ["variant of", "abbr. for", "CL:"].reduce(
      (p, c) => p + Number(entry.includes(c)) * 100,
      entry.length,
    );
  }

  return engs.sort((a, b) => score(a) - score(b));
}
