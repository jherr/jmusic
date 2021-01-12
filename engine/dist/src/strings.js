"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chordFinder = exports.StringedChord = exports.StringedInstrument = exports.getTuningsByStringCount = exports.getTuningByName = exports.TUNINGS = exports.Tuning = exports.StringedInstrumentLocation = void 0;
const theory_1 = require("./theory");
const shapes_1 = require("./shapes");
const GUITAR_BASE_NOTE = 40;
const BASS_BAS_NOTE = 28;
const STANDARD_FRET_COUNT = 22;
class StringedInstrumentLocation {
    constructor(string, fret) {
        this.string = string;
        this.fret = fret;
    }
}
exports.StringedInstrumentLocation = StringedInstrumentLocation;
class Tuning {
    constructor(name, intervals) {
        this.name = name;
        this.intervals = intervals;
    }
}
exports.Tuning = Tuning;
exports.TUNINGS = [
    new Tuning("Guitar Standard", [0, 5, 5, 5, 4, 5]),
    new Tuning("D Modal", [-2, 7, 5, 5, 2, 5]),
    new Tuning("Dropped D", [-2, 7, 5, 5, 4, 5]),
    new Tuning("Dropped D & A", [-2, 7, 5, 5, 2, 7]),
    new Tuning("Dropped semi-tone", [-1, 5, 5, 5, 4, 5]),
    new Tuning("Dropped whole-tone", [-2, 5, 5, 5, 4, 5]),
    new Tuning("G Modal", [-2, 5, 7, 5, 5, 2]),
    new Tuning("Open C", [-4, 7, 5, 7, 5, 4]),
    new Tuning("Open C II", [0, 3, 5, 4, 8, 7]),
    new Tuning("Open D", [-2, 7, 5, 4, 3, 5]),
    new Tuning("Open D Minor", [-2, 7, 5, 3, 4, 5]),
    new Tuning("Open E", [0, 7, 5, 4, 3, 5]),
    new Tuning("Open E Minor", [0, 7, 5, 3, 4, 5]),
    new Tuning("Open Eb", [-1, 5, 5, 5, 4, 5]),
    new Tuning("Open G", [-2, 5, 7, 5, 4, 3]),
    new Tuning("Bass Standard", [0, 5, 5, 5]),
];
const getTuningByName = (n) => exports.TUNINGS.find(({ name }) => name === n) ?? exports.TUNINGS[0];
exports.getTuningByName = getTuningByName;
const getTuningsByStringCount = (count) => exports.TUNINGS.filter(({ intervals }) => intervals.length === count);
exports.getTuningsByStringCount = getTuningsByStringCount;
class StringedInstrument {
    constructor(startNote, numFrets, tuning) {
        this.startNote = startNote;
        this.numFrets = numFrets;
        this.tuningName = "";
        this.tuning = [];
        this.midiTuning = [];
        this.tuningName = tuning.name;
        let midiNoteValue = this.startNote;
        tuning.intervals.forEach((ti) => {
            midiNoteValue += ti;
            this.midiTuning.push(midiNoteValue);
            this.tuning.push(theory_1.getNoteFromMIDI(midiNoteValue));
        });
    }
    static get bass() {
        return new StringedInstrument(BASS_BAS_NOTE, STANDARD_FRET_COUNT, exports.getTuningByName("Bass Standard"));
    }
    static get guitar() {
        return new StringedInstrument(GUITAR_BASE_NOTE, STANDARD_FRET_COUNT, exports.getTuningByName("Guitar Standard"));
    }
    findNotes(note) {
        const locations = [];
        this.midiTuning.forEach((startNote, string) => {
            let fret = note - (startNote % 12);
            while (fret < this.numFrets) {
                if (fret >= 0) {
                    locations.push(new StringedInstrumentLocation(string, fret));
                }
                fret += 12;
            }
        });
        return locations;
    }
    get numStrings() {
        return this.tuning.length;
    }
    get topNotes() {
        return this.midiTuning;
    }
    get topNames() {
        return this.topNotes.map((n) => theory_1.SCALE_NOTES[n % 12]);
    }
    noteAt(string, fret) {
        return fret !== -1 ? this.midiTuning[string] + fret : -1;
    }
}
exports.StringedInstrument = StringedInstrument;
class StringedChord {
    constructor(instrument, notes = []) {
        this.instrument = instrument;
        this.notes = notes;
        if (this.notes.length === 0) {
            this.notes = this.instrument.midiTuning.map(() => -1);
        }
        this.inversion = -1;
        this.playability = -1;
        this.extras = 0;
        this.capo = 0;
        this.calculatePlayability();
    }
    toShape() {
        return new shapes_1.Shape(this.notes);
    }
    calculatePlayability() {
        const info = shapes_1.compareWithKnownShapes(this.toShape());
        this.playability = info.min;
        this.extras = info.extras;
    }
    compare(other) {
        let diff = 0;
        other.notes.forEach((on, string) => {
            diff += Math.abs(this.notes[string] - on);
        });
        return diff;
    }
    contains(other) {
        let contains = true;
        this.notes.forEach((n, string) => {
            if (n === -1) {
                if (other.notes[string] !== -1) {
                    contains = false;
                }
            }
            else if (other.notes[string] !== -1) {
                if (other.notes[string] !== n) {
                    contains = false;
                }
            }
        });
        return contains;
    }
    get maxFret() {
        return Math.max(...this.notes);
    }
    get minFret() {
        return Math.min(...this.notes.filter((n) => n > -1));
    }
    get isOpen() {
        return this.maxFret - this.capo <= 6;
    }
    get hasOpen() {
        return this.minFret === this.capo && this.isOpen;
    }
    get classic() {
        return (this.extras & shapes_1.CLASSIC) === 1;
    }
    get barChord() {
        return (this.extras & shapes_1.BAR_CHORD) === 1;
    }
    get count() {
        return this.notes.filter((n) => n !== -1).length;
    }
    setCapo(fret) {
        this.capo = fret;
    }
    get midiNotes() {
        return this.notes.map((note, string) => this.instrument.noteAt(string, note));
    }
    get lowestNote() {
        return Math.min(...this.midiNotes.filter((n) => n !== -1)) % 12;
    }
    setNote(string, fret) {
        this.notes[string] = fret;
        this.calculatePlayability();
    }
    hasNote(string) {
        return this.notes[string] !== -1;
    }
    get median() {
        let total = 0, count = 0;
        this.notes
            .filter((n) => n !== -1)
            .forEach((n) => {
            total += n;
            count += 1;
        });
        return count > 0 ? total / count : 0;
    }
    get contiguous() {
        let ContiguousState;
        (function (ContiguousState) {
            ContiguousState[ContiguousState["Before"] = 0] = "Before";
            ContiguousState[ContiguousState["Inside"] = 1] = "Inside";
            ContiguousState[ContiguousState["Outside"] = 2] = "Outside";
        })(ContiguousState || (ContiguousState = {}));
        let state = ContiguousState.Before;
        let contig = true;
        this.notes.forEach((note) => {
            if (note === -1) {
                if (state === ContiguousState.Inside) {
                    state = ContiguousState.Outside;
                }
            }
            else {
                if (state === ContiguousState.Before) {
                    state = ContiguousState.Inside;
                }
                if (state === ContiguousState.Outside) {
                    contig = false;
                }
            }
        });
        return contig;
    }
    get notation() {
        return this.notes.map((n) => n.toString().padStart(2, " ")).join(" ");
    }
    get locationString() {
        return this.midiNotes.join(" ");
    }
    toString() {
        return this.midiNotes
            .map((n) => n !== -1 ? theory_1.SCALE_NOTES[theory_1.getNoteFromMIDI(n)].padStart(2, " ") : "  ")
            .join(" ");
    }
}
exports.StringedChord = StringedChord;
class ChordOrderStrategy {
    constructor() {
        this.distance = 10;
        this.open = 0;
        this.difficulty = 10;
        this.bar = 10;
        this.classic = 10;
        this.noteCount = 0;
    }
    static wide() {
        const stategy = new ChordOrderStrategy();
        stategy.noteCount = 2000;
        return stategy;
    }
    static open() {
        const stategy = new ChordOrderStrategy();
        stategy.open = 5000;
        stategy.noteCount = 1000;
        return stategy;
    }
    static easy() {
        const stategy = new ChordOrderStrategy();
        stategy.difficulty = 500;
        return stategy;
    }
    static barChords() {
        const stategy = new ChordOrderStrategy();
        stategy.bar = 5000;
        return stategy;
    }
    static classic() {
        const stategy = new ChordOrderStrategy();
        stategy.classic = 5000;
        return stategy;
    }
    static boxed() {
        const stategy = new ChordOrderStrategy();
        stategy.distance = 1000;
        return stategy;
    }
    weight(a, b) {
        const am = a !== null ? a.median : 0;
        const bm = b !== null ? b.median : 0;
        let weight = 10000;
        weight -= Math.abs(am - bm) * this.distance;
        let open = 0;
        if (b?.isOpen) {
            open += 1;
        }
        if (b?.hasOpen) {
            open += 10;
        }
        weight -= open * this.open;
        weight -= (50 - (b?.playability || 50)) * this.difficulty;
        weight -= (b?.classic ? 1 : 0) * this.classic;
        weight -= (b?.barChord ? 1 : 0) * this.bar;
        weight -= (b?.count ?? 0) * this.noteCount;
        return weight;
    }
}
class ChordList extends Array {
    constructor(instrument, chord, root) {
        super();
        this.instrument = instrument;
        this.chord = chord;
        this.root = root;
    }
    reorder(previousChord, strategy) {
        const weightedChords = this.map((chord) => ({
            weight: strategy.weight(previousChord, chord),
            chord,
        })).sort((a, b) => a.weight < b.weight ? -1 : a.weight === b.weight ? 0 : 1);
        const newChords = new ChordList(this.instrument, this.chord, this.root);
        weightedChords.forEach(({ chord }) => newChords.push(chord));
        return newChords;
    }
}
const chordFinder = (instrument, spelling, root, options) => {
    const createChordList = () => new ChordList(instrument, spelling, root);
    const notes = spelling.notes(root);
    const distance = options?.distance || 4;
    const addChords = (chords, doubling = false) => {
        let newChords = createChordList();
        chords.forEach((chord) => newChords.push(chord));
        notes.forEach((note) => {
            if (newChords.length === 0) {
                instrument.findNotes(note).forEach((location) => {
                    const chord = new StringedChord(instrument);
                    chord.setNote(location.string, location.fret);
                    newChords.push(chord);
                });
            }
            else {
                let addedChords = createChordList();
                newChords.forEach((chord) => {
                    if (doubling) {
                        addedChords.push(chord);
                    }
                    instrument.findNotes(note).forEach((location) => {
                        if (!chord.hasNote(location.string)) {
                            const newChord = new StringedChord(instrument, [...chord.notes]);
                            newChord.setNote(location.string, location.fret);
                            if (newChord.maxFret - newChord.minFret <= distance) {
                                addedChords.push(newChord);
                            }
                        }
                    });
                });
                newChords = addedChords;
            }
        });
        return newChords;
    };
    let chords = createChordList();
    chords = addChords(chords);
    if (options?.doubling) {
        chords = addChords(chords, true);
        chords = addChords(chords, true);
    }
    const duplicates = {};
    const newChords = createChordList();
    chords.forEach((chord) => {
        const key = chord.locationString;
        if (!duplicates[key]) {
            newChords.push(chord);
        }
        duplicates[key] = true;
    });
    chords = newChords;
    chords.sort((a, b) => (a.count < b.count ? 1 : a.count === b.count ? 0 : -1));
    const superChords = createChordList();
    chords.forEach((chord) => {
        let found = false;
        superChords.forEach((superChord) => {
            if (superChord.contains(chord)) {
                found = true;
            }
        });
        if (!found) {
            superChords.push(chord);
        }
    });
    chords = superChords;
    chords.sort((a, b) => {
        let diff = a.playability < b.playability
            ? -1
            : a.playability === b.playability
                ? 0
                : 1;
        if (diff === 0) {
            diff = a.minFret < b.minFret ? -1 : a.minFret === b.minFret ? 0 : 1;
        }
        return diff;
    });
    const inversionMap = spelling.inversions(root);
    chords.forEach((chord) => {
        chord.inversion = inversionMap[chord.lowestNote];
    });
    return chords;
};
exports.chordFinder = chordFinder;
