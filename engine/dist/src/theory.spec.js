"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theory_1 = require("./theory");
describe("theory", () => {
    it("should find a note", () => {
        expect(theory_1.getNoteByName("c#")).toEqual(1);
        expect(theory_1.getNoteByName("e")).toEqual(4);
    });
    it("should find a MIDI note", () => {
        expect(theory_1.getNoteFromMIDI(65)).toEqual(5);
    });
    it("should parse a tone", () => {
        expect(theory_1.Tone.parse("")).toBeNull();
        expect(theory_1.Tone.parse("3")).toEqual({
            root: 3,
            augment: 0,
        });
        expect(theory_1.Tone.parse("3b")).toEqual({
            root: 3,
            augment: -1,
        });
    });
    it("should find a chord", () => {
        expect(theory_1.getChordByName("Maj.")?.notes(0)).toEqual([0, 4, 7]);
    });
});
