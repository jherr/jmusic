"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShortName = exports.getChordByShortName = exports.getChordByName = exports.CHORDS = exports.ChordSpelling = exports.Tone = exports.AUGMENTS = exports.SCALES = exports.Scale = exports.getNoteFromMIDI = exports.getNoteByName = exports.CircleOfFifths = exports.CircleOfFifthsImpl = exports.SCALE_NOTES = exports.IONIAN_SCALE = void 0;
exports.IONIAN_SCALE = [2, 2, 1, 2, 2, 2, 1];
exports.SCALE_NOTES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];
class CircleOfFifthsImpl {
    constructor() {
        this.scales = [];
        for (let root = 0; root <= 12; root++) {
            let fnote = root;
            this.scales[root] = [fnote];
            for (let item = 0; item <= 14; item++) {
                fnote += exports.IONIAN_SCALE[item % 7];
                this.scales[root].push(fnote % 12);
            }
        }
    }
}
exports.CircleOfFifthsImpl = CircleOfFifthsImpl;
exports.CircleOfFifths = new CircleOfFifthsImpl();
const getNoteByName = (name) => exports.SCALE_NOTES.findIndex((note) => note === name.toUpperCase());
exports.getNoteByName = getNoteByName;
const getNoteFromMIDI = (midi) => midi % 12;
exports.getNoteFromMIDI = getNoteFromMIDI;
class Scale {
    constructor(name, intervals) {
        this.name = name;
        this.intervals = intervals;
    }
}
exports.Scale = Scale;
exports.SCALES = [
    new Scale("Ionian (major)", [2, 2, 1, 2, 2, 2, 1]),
    new Scale("Dorian", [2, 1, 2, 2, 2, 1, 2]),
    new Scale("Phrygian", [1, 2, 2, 2, 1, 2, 2]),
    new Scale("Lydian", [2, 2, 2, 1, 2, 2, 1]),
    new Scale("Mixolydian", [2, 2, 1, 2, 2, 1, 2]),
    new Scale("Aeolian", [2, 1, 2, 2, 1, 2, 2]),
    new Scale("Locrian", [1, 2, 2, 1, 2, 2, 2]),
    new Scale("Chromatic", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
    new Scale("Adolfos Scale", [1, 2, 2, 1, 1, 2, 2]),
    new Scale("Diminished", [2, 1, 2, 1, 2, 1, 2, 1]),
    new Scale("Enigmatic", [1, 3, 2, 2, 2, 1, 1]),
    new Scale("Harmonic Minor", [2, 1, 2, 2, 1, 3, 1]),
    new Scale("Hungarian Minor", [2, 1, 3, 1, 1, 3, 1]),
    new Scale("Melodic Minor", [2, 1, 2, 2, 2, 2, 1]),
    new Scale("Neapolitan", [1, 2, 2, 2, 2, 2, 1]),
    new Scale("Neapolitan Minor", [1, 2, 2, 2, 1, 3, 1]),
    new Scale("Pentatonic", [2, 2, 3, 2, 3]),
    new Scale("Pentatonic Minor", [3, 2, 2, 3, 2]),
    new Scale("Ten Tone", [1, 2, 1, 1, 1, 1, 2, 1, 1]),
    new Scale("Whole Tone", [2, 2, 2, 2, 2, 2]),
];
exports.AUGMENTS = {
    "#": 1,
    "##": 2,
    b: -1,
    bb: -2,
    "": 0,
};
class Tone {
    constructor(root, augment) {
        this.root = root;
        this.augment = augment;
    }
    static parse(text) {
        const found = text.match(/^(\d+)(.*)$/);
        return found
            ? new Tone(parseInt(found[1]), exports.AUGMENTS[found?.[2]] ?? 0)
            : null;
    }
}
exports.Tone = Tone;
class ChordSpelling {
    constructor(name, shortName, toneString) {
        this.name = name;
        this.shortName = shortName;
        this.tones = toneString.split(",").map((t) => Tone.parse(t));
    }
    note(root, tone) {
        const fnote = exports.CircleOfFifths.scales[root][tone.root - 1] + tone.augment;
        return (fnote + 12) % 12;
    }
    notes(root) {
        return this.tones.map((t) => this.note(root, t));
    }
    inversions(root) {
        const map = {};
        this.notes(root).forEach((n, inv) => {
            map[n] = inv + 1;
        });
        return map;
    }
}
exports.ChordSpelling = ChordSpelling;
exports.CHORDS = [
    new ChordSpelling("Maj.", ",maj", "1,3,5"),
    new ChordSpelling("11th", "11", "1,3,5,7b,9,11"),
    new ChordSpelling("11th-9", null, "1,3,5,7b,9b,11"),
    new ChordSpelling("13th", "13", "1,3,5,7b,9,11,13"),
    new ChordSpelling("13th no 5th", null, "1,3,7b,9,11,13"),
    new ChordSpelling("6th", "6", "1,3,5,6"),
    new ChordSpelling("6th-7", null, "1,3,5,6,7b"),
    new ChordSpelling("6th-7 Sus.", null, "1,4,5,6,7b"),
    new ChordSpelling("7th", "7", "1,3,5,7b"),
    new ChordSpelling("7th-9+5", null, "1,3,5#,7b,9b"),
    new ChordSpelling("7th+11", "7+11", "1,3,5,7b,9,11#"),
    new ChordSpelling("7th+5", "7+5", "1,3,5#,7b"),
    new ChordSpelling("7th+9", "7+9", "1,3,5,7b,9#"),
    new ChordSpelling("7th+9+5", null, "1,3,5#,7b,9#"),
    new ChordSpelling("7th+9-5", null, "1,3,5b,7b,9#"),
    new ChordSpelling("7th-5", "7-5", "1,3,5b,7b"),
    new ChordSpelling("7th-9", "7-9", "1,3,5,7b,9b"),
    new ChordSpelling("7th-9-5", null, "1,3,5b,7b,9b"),
    new ChordSpelling("7th Sus. 4", "7sus4", "1,4,5,7b"),
    new ChordSpelling("7th-11", null, "1,3,5,7b,11"),
    new ChordSpelling("9th", "9", "1,3,5,7b,9"),
    new ChordSpelling("9th+5", "9+5", "1,3,5#,7b,9"),
    new ChordSpelling("9th-5", "9-5", "1,3,5b,7b,9"),
    new ChordSpelling("Add +11", null, "1,3,5,11#"),
    new ChordSpelling("Add 9", "add9", "1,3,5,9"),
    new ChordSpelling("Aug.", "aug", "1,3,5#"),
    new ChordSpelling("Dim.", "dim", "1,3b,5b"),
    new ChordSpelling("Dim. 7th", "dim7,7dim", "1,3b,5b,7bb"),
    new ChordSpelling("Maj. 6 add 9", null, "1,3,5,6,9"),
    new ChordSpelling("Maj. 7th", "maj7,7maj", "1,3,5,7"),
    new ChordSpelling("Maj. 7th+11", null, "1,3,5,7,11#"),
    new ChordSpelling("Maj. 7th+5", null, "1,3,5#,7"),
    new ChordSpelling("Maj. 7th-5", null, "1,3,5b,7"),
    new ChordSpelling("Maj. 9th", "maj9,9maj", "1,3,5,7,9"),
    new ChordSpelling("Maj. 9th+11", null, "1,3,5,7,9,11#"),
    new ChordSpelling("Maj.-Min. 7th", null, "1,3b,5,7"),
    new ChordSpelling("Min.", "m,min", "1,3b,5"),
    new ChordSpelling("Min. 11th", "maj11", "1,3b,5,7b,9,11"),
    new ChordSpelling("Min. 6th", "maj6", "1,3b,5,6"),
    new ChordSpelling("Min. 6th Add 9", null, "1,3b,5,6,9"),
    new ChordSpelling("Min. 6th-7", null, "1,3b,5,6,7b"),
    new ChordSpelling("Min. 6th-7-11", null, "1,3b,5,6,7b,11"),
    new ChordSpelling("Min. 7th", "maj7", "1,3b,5,7b"),
    new ChordSpelling("Min. 7th-5", null, "1,3b,5b,7b"),
    new ChordSpelling("Min. 7th-9", null, "1,3b,5,7b,9b"),
    new ChordSpelling("Min. 7th-11", null, "1,3b,5,7b,11"),
    new ChordSpelling("Min. 9th", "maj9", "1,3b,5,7b,9"),
    new ChordSpelling("Min. 9th-5", null, "1,3b,5b,7b,9"),
    new ChordSpelling("Min. Add 9", "min+9", "1,3b,5,9"),
    new ChordSpelling("Min.-Maj. 9th", null, "1,3b,5,7,9"),
    new ChordSpelling("Sus. 4", "sus4", "1,4,5"),
];
const getChordByName = (name) => exports.CHORDS.find((c) => c.name === name);
exports.getChordByName = getChordByName;
const getChordByShortName = (name) => exports.CHORDS.filter(({ shortName }) => shortName).find((spelling) => spelling.shortName?.split(",").includes(name));
exports.getChordByShortName = getChordByShortName;
const parseShortName = (shortName) => {
    const found = shortName.match(/([A-Z](?:[b#])?)(.*?)$/i);
    if (!found) {
        return null;
    }
    let root = 0;
    if (found[1].search(/[A-Z]b/i)) {
        const rootFound = found[1].match(/([A-Z])/)?.[1];
        if (!rootFound) {
            return null;
        }
        root = (exports.getNoteByName(rootFound[1]) + 11) % 12;
    }
    else {
        root = exports.getNoteByName(found[1]);
    }
    return {
        root,
        chord: exports.getChordByShortName(shortName),
    };
};
exports.parseShortName = parseShortName;
