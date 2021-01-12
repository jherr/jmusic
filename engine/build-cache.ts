import * as fs from "fs";
import { StringedInstrument, chordFinder, CHORDS } from "./src/index";

const createCache = () => {
  CHORDS.forEach((chord) => {
    for (let root = 0; root < 12; root++) {
      const instrument = StringedInstrument.guitar;
      const name = ["guitar", instrument.tuningName, chord.name, root].join(
        "_"
      );
      console.log(name);

      const path = `../cache/${name}.json`;

      if (!fs.existsSync(path)) {
        const chords = chordFinder(instrument, chord, root, {
          doubling: true,
          distance: 4,
        });
        fs.writeFileSync(
          path,
          JSON.stringify({
            version: 1,
            chords: chords.map((c) => ({
              notes: c.notes,
              inversion: c.inversion,
              playability: c.playability,
              extras: c.extras,
            })),
          })
        );
      }
    }
  });
};

createCache();
