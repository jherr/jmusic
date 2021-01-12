import { getChordByName, getNoteByName, getNoteFromMIDI, Tone } from "./theory";

describe("theory", () => {
  it("should find a note", () => {
    expect(getNoteByName("c#")).toEqual(1);
    expect(getNoteByName("e")).toEqual(4);
  });

  it("should find a MIDI note", () => {
    expect(getNoteFromMIDI(65)).toEqual(5);
  });

  it("should parse a tone", () => {
    expect(Tone.parse("")).toBeNull();
    expect(Tone.parse("3")).toEqual({
      root: 3,
      augment: 0,
    });
    expect(Tone.parse("3b")).toEqual({
      root: 3,
      augment: -1,
    });
  });

  it("should find a chord", () => {
    expect(getChordByName("Maj.")?.notes(0)).toEqual([0, 4, 7]);
  });
});
