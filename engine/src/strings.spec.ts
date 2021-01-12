import {
  StringedInstrument,
  getTuningByName,
  getTuningsByStringCount,
  StringedChord,
  chordFinder,
} from "./strings";
import { getChordByName, ChordSpelling, getNoteByName } from "./theory";

describe("Strings", () => {
  it("Should find tunings", () => {
    expect(getTuningByName("").name).toEqual("Guitar Standard");
    expect(getTuningByName("Bass Standard").name).toEqual("Bass Standard");
    expect(getTuningsByStringCount(4).length).toEqual(1);
  });

  it("Should make guitars", () => {
    const guitar = StringedInstrument.guitar;
    expect(guitar.topNames).toEqual(["E", "A", "D", "G", "B", "E"]);
    expect(guitar.numFrets).toEqual(22);
    expect(guitar.numStrings).toEqual(6);
    expect(guitar.noteAt(0, 0)).toEqual(40);
    expect(guitar.noteAt(1, 0)).toEqual(45);
    expect(guitar.noteAt(1, 5)).toEqual(50);
    expect(guitar.noteAt(1, -1)).toEqual(-1);
  });

  it("Should make basses", () => {
    const bass = StringedInstrument.bass;
    expect(bass.topNames).toEqual(["E", "A", "D", "G"]);
    expect(bass.numFrets).toEqual(22);
    expect(bass.numStrings).toEqual(4);
  });

  it("Should find notes", () => {
    const bass = StringedInstrument.bass;
    expect(bass.topNotes).toEqual([28, 33, 38, 43]);
    expect(bass.findNotes(4).length).toEqual(8);
    expect(bass.findNotes(4)[0]).toEqual({
      fret: 0,
      string: 0,
    });
  });

  it("Should check if chords contain other chords", () => {
    const a = new StringedChord(StringedInstrument.bass, [1, 2, -1, -1]);
    const b = new StringedChord(StringedInstrument.bass, [1, 2, 1, -1]);
    expect(b.contains(a)).toEqual(true);
    expect(a.contains(b)).toEqual(false);
  });

  it("Should calculate metrics on chords", () => {
    const a = new StringedChord(StringedInstrument.bass, [1, 6, 8, -1]);
    expect(a.maxFret).toEqual(8);
    expect(a.minFret).toEqual(1);
    expect(a.median).toEqual(5);
  });

  it("Should calculate contiguousness on chords", () => {
    expect(
      new StringedChord(StringedInstrument.bass, [1, 6, 8, -1]).contiguous
    ).toEqual(true);
    expect(
      new StringedChord(StringedInstrument.bass, [-1, 6, 8, -1]).contiguous
    ).toEqual(true);
    expect(
      new StringedChord(StringedInstrument.bass, [1, -1, 8, -1]).contiguous
    ).toEqual(false);
  });

  it("Should do chord notations", () => {
    expect(
      new StringedChord(StringedInstrument.bass, [1, 6, 8, -1]).notation
    ).toEqual(" 1  6  8 -1");
    expect(
      new StringedChord(StringedInstrument.bass, [1, 6, 10, -1]).notation
    ).toEqual(" 1  6 10 -1");
    expect(
      new StringedChord(StringedInstrument.bass, [1, 6, 10, -1]).locationString
    ).toEqual("29 39 48 -1");
    expect(
      new StringedChord(StringedInstrument.bass, [0, 0, 0, 0]).toString()
    ).toEqual(" E  A  D  G");
  });

  // it("Should find some chords", () => {
  //   const chords = chordFinder(
  //     StringedInstrument.guitar,
  //     getChordByName("Maj.") as ChordSpelling,
  //     getNoteByName("e"),
  //     {
  //       doubling: true,
  //       distance: 4,
  //     }
  //   );
  //   expect(chords.length).toEqual(7);
  //   expect(chords[0].notation).toEqual(7);
  // });
});
