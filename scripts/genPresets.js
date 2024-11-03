// @ts-check

import fs from "fs/promises";
import path from "path";
import SoundFont2 from "soundfont2";
const arr = {};

const soundfont = await fs
  .readFile(
    path.join(import.meta.dirname, "../assets/GeneralUser GS v1.471.sf2"),
  )
  .then((buffer) => new SoundFont2.SoundFont2(buffer));

for (const bank of soundfont.banks) {
  if (!bank) continue;
  for (const preset of bank.presets) {
    if (!preset) continue;
    const a = arr[preset.header.bank] ?? {};
    a[preset.header.preset] = preset.header.name;
    arr[preset.header.bank] = a;
  }
}

fs.writeFile(
  path.join(import.meta.dirname, "../assets/presets.json"),
  JSON.stringify(arr),
);
