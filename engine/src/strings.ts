import { getNoteFromMIDI, SCALE_NOTES, ChordSpelling } from "./theory";
import { Shape, compareWithKnownShapes, CLASSIC, BAR_CHORD } from "./shapes";

const GUITAR_BASE_NOTE = 40;
const BASS_BAS_NOTE = 28;
const STANDARD_FRET_COUNT = 22;

export class StringedInstrumentLocation {
  constructor(public string: number, public fret: number) {}
}

export class Tuning {
  constructor(public name: string, public intervals: number[]) {}
}

export const TUNINGS = [
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

export const getTuningByName = (n: string): Tuning =>
  TUNINGS.find(({ name }) => name === n) ?? TUNINGS[0];
export const getTuningsByStringCount = (count: number): Tuning[] =>
  TUNINGS.filter(({ intervals }) => intervals.length === count);

export class StringedInstrument {
  tuningName: string = "";
  tuning: number[] = [];
  midiTuning: number[] = [];

  constructor(
    public startNote: number,
    public numFrets: number,
    tuning: Tuning
  ) {
    this.tuningName = tuning.name;
    let midiNoteValue = this.startNote;
    tuning.intervals.forEach((ti) => {
      midiNoteValue += ti;
      this.midiTuning.push(midiNoteValue);
      this.tuning.push(getNoteFromMIDI(midiNoteValue));
    });
  }

  static get bass(): StringedInstrument {
    return new StringedInstrument(
      BASS_BAS_NOTE,
      STANDARD_FRET_COUNT,
      getTuningByName("Bass Standard")
    );
  }

  static get guitar(): StringedInstrument {
    return new StringedInstrument(
      GUITAR_BASE_NOTE,
      STANDARD_FRET_COUNT,
      getTuningByName("Guitar Standard")
    );
  }

  findNotes(note: number): StringedInstrumentLocation[] {
    const locations: StringedInstrumentLocation[] = [];
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

  get numStrings(): number {
    return this.tuning.length;
  }

  get topNotes(): number[] {
    return this.midiTuning;
  }

  get topNames(): string[] {
    return this.topNotes.map((n) => SCALE_NOTES[n % 12]);
  }

  noteAt(string: number, fret: number): number {
    return fret !== -1 ? this.midiTuning[string] + fret : -1;
  }
}

export class StringedChord {
  inversion: number;
  playability: number;
  extras: number;
  capo: number;

  constructor(
    public instrument: StringedInstrument,
    public notes: number[] = []
  ) {
    if (this.notes.length === 0) {
      this.notes = this.instrument.midiTuning.map(() => -1);
    }
    this.inversion = -1;
    this.playability = -1;
    this.extras = 0;
    this.capo = 0;
    this.calculatePlayability();
  }

  toShape(): Shape {
    return new Shape(this.notes);
  }

  private calculatePlayability() {
    const info = compareWithKnownShapes(this.toShape());
    this.playability = info.min;
    this.extras = info.extras;
  }

  compare(other: StringedChord): number {
    let diff = 0;
    other.notes.forEach((on, string) => {
      diff += Math.abs(this.notes[string] - on);
    });
    return diff;
  }

  contains(other: StringedChord): boolean {
    let contains = true;
    this.notes.forEach((n, string) => {
      if (n === -1) {
        if (other.notes[string] !== -1) {
          contains = false;
        }
      } else if (other.notes[string] !== -1) {
        if (other.notes[string] !== n) {
          contains = false;
        }
      }
    });
    return contains;
  }

  get maxFret(): number {
    return Math.max(...this.notes);
  }

  get minFret(): number {
    return Math.min(...this.notes.filter((n) => n > -1));
  }

  get isOpen(): boolean {
    return this.maxFret - this.capo <= 6;
  }

  get hasOpen(): boolean {
    return this.minFret === this.capo && this.isOpen;
  }

  get classic(): boolean {
    return (this.extras & CLASSIC) === 1;
  }

  get barChord(): boolean {
    return (this.extras & BAR_CHORD) === 1;
  }

  get count(): number {
    return this.notes.filter((n) => n !== -1).length;
  }

  setCapo(fret: number): void {
    this.capo = fret;
  }

  get midiNotes(): number[] {
    return this.notes.map((note, string) =>
      this.instrument.noteAt(string, note)
    );
  }

  get lowestNote(): number {
    return Math.min(...this.midiNotes.filter((n) => n !== -1)) % 12;
  }

  setNote(string: number, fret: number): void {
    this.notes[string] = fret;
    this.calculatePlayability();
  }

  hasNote(string: number): boolean {
    return this.notes[string] !== -1;
  }

  get median(): number {
    let total = 0,
      count = 0;
    this.notes
      .filter((n) => n !== -1)
      .forEach((n) => {
        total += n;
        count += 1;
      });
    return count > 0 ? total / count : 0;
  }

  get contiguous(): boolean {
    enum ContiguousState {
      Before,
      Inside,
      Outside,
    }
    let state: ContiguousState = ContiguousState.Before;
    let contig = true;
    this.notes.forEach((note) => {
      if (note === -1) {
        if (state === ContiguousState.Inside) {
          state = ContiguousState.Outside;
        }
      } else {
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

  get notation(): string {
    return this.notes.map((n) => n.toString().padStart(2, " ")).join(" ");
  }

  get locationString(): string {
    return this.midiNotes.join(" ");
  }

  toString(): string {
    return this.midiNotes
      .map((n) =>
        n !== -1 ? SCALE_NOTES[getNoteFromMIDI(n)].padStart(2, " ") : "  "
      )
      .join(" ");
  }
}

class ChordOrderStrategy {
  distance: number = 10;
  open: number = 0;
  difficulty: number = 10;
  bar: number = 10;
  classic: number = 10;
  noteCount: number = 0;

  static wide(): ChordOrderStrategy {
    const stategy = new ChordOrderStrategy();
    stategy.noteCount = 2000;
    return stategy;
  }

  static open(): ChordOrderStrategy {
    const stategy = new ChordOrderStrategy();
    stategy.open = 5000;
    stategy.noteCount = 1000;
    return stategy;
  }

  static easy(): ChordOrderStrategy {
    const stategy = new ChordOrderStrategy();
    stategy.difficulty = 500;
    return stategy;
  }

  static barChords(): ChordOrderStrategy {
    const stategy = new ChordOrderStrategy();
    stategy.bar = 5000;
    return stategy;
  }

  static classic(): ChordOrderStrategy {
    const stategy = new ChordOrderStrategy();
    stategy.classic = 5000;
    return stategy;
  }

  static boxed(): ChordOrderStrategy {
    const stategy = new ChordOrderStrategy();
    stategy.distance = 1000;
    return stategy;
  }

  weight(a: StringedChord | null, b: StringedChord | null): number {
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

class ChordList extends Array<StringedChord> {
  constructor(
    public instrument: StringedInstrument,
    public chord: ChordSpelling,
    public root: number
  ) {
    super();
  }

  reorder(
    previousChord: StringedChord,
    strategy: ChordOrderStrategy
  ): ChordList {
    const weightedChords: {
      weight: number;
      chord: StringedChord;
    }[] = this.map((chord: StringedChord) => ({
      weight: strategy.weight(previousChord, chord),
      chord,
    })).sort((a, b) =>
      a.weight < b.weight ? -1 : a.weight === b.weight ? 0 : 1
    );

    const newChords = new ChordList(this.instrument, this.chord, this.root);
    weightedChords.forEach(({ chord }) => newChords.push(chord));
    return newChords;
  }
}

export interface ChordFinderOptions {
  distance: number;
  doubling: boolean;
}

export const chordFinder = (
  instrument: StringedInstrument,
  spelling: ChordSpelling,
  root: number,
  options: ChordFinderOptions
): ChordList => {
  const createChordList = () => new ChordList(instrument, spelling, root);
  const notes = spelling.notes(root);
  const distance = options?.distance || 4;

  const addChords = (
    chords: ChordList,
    doubling: boolean = false
  ): ChordList => {
    let newChords = createChordList();
    chords.forEach((chord) => newChords.push(chord));
    notes.forEach((note) => {
      if (newChords.length === 0) {
        instrument.findNotes(note).forEach((location) => {
          const chord = new StringedChord(instrument);
          chord.setNote(location.string, location.fret);
          newChords.push(chord);
        });
      } else {
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

  const duplicates: { [key: string]: boolean } = {};
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
    let diff =
      a.playability < b.playability
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
