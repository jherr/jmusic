"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./src/index");
const chords = index_1.chordFinder(index_1.StringedInstrument.guitar, index_1.getChordByName("Maj."), index_1.getNoteByName("e"), {
    doubling: true,
    distance: 4,
});
chords.forEach((chord) => {
    console.log(`${chord.notation} ${chord.playability}`);
});
