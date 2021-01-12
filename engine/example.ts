import {
  StringedInstrument,
  chordFinder,
  getChordByName,
  ChordSpelling,
  getNoteByName,
} from "./src/index";

const chords = chordFinder(
  StringedInstrument.guitar,
  getChordByName("Maj.") as ChordSpelling,
  getNoteByName("e"),
  {
    doubling: true,
    distance: 4,
  }
);

chords.forEach((chord) => {
  console.log(`${chord.notation} ${chord.playability}`);
});
