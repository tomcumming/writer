import { downloadEntries } from "./cedict.js";
import _x from "./components/app.js";
import * as DB from "./db.js";

(self as any).testIt = async function () {
  const db = await DB.openDb();

  // const entries = await downloadEntries();
  // DB.writeEntries(db, entries);

  const ws = await DB.searchPrefixes(db, "來得容易，去得快");
  // const ws = await DB.searchPrefixes(db, '上官');
  console.log(ws);
  for (const w of ws) {
    console.log(await DB.lookupEntries(db, w));
  }
};
