import { ChordSpelling } from "./theory";
import { Shape } from "./shapes";
export declare class StringedInstrumentLocation {
    string: number;
    fret: number;
    constructor(string: number, fret: number);
}
export declare class Tuning {
    name: string;
    intervals: number[];
    constructor(name: string, intervals: number[]);
}
export declare const TUNINGS: Tuning[];
export declare const getTuningByName: (n: string) => Tuning;
export declare const getTuningsByStringCount: (count: number) => Tuning[];
export declare class StringedInstrument {
    startNote: number;
    numFrets: number;
    tuningName: string;
    tuning: number[];
    midiTuning: number[];
    constructor(startNote: number, numFrets: number, tuning: Tuning);
    static get bass(): StringedInstrument;
    static get guitar(): StringedInstrument;
    findNotes(note: number): StringedInstrumentLocation[];
    get numStrings(): number;
    get topNotes(): number[];
    get topNames(): string[];
    noteAt(string: number, fret: number): number;
}
export declare class StringedChord {
    instrument: StringedInstrument;
    notes: number[];
    inversion: number;
    playability: number;
    extras: number;
    capo: number;
    constructor(instrument: StringedInstrument, notes?: number[]);
    toShape(): Shape;
    private calculatePlayability;
    compare(other: StringedChord): number;
    contains(other: StringedChord): boolean;
    get maxFret(): number;
    get minFret(): number;
    get isOpen(): boolean;
    get hasOpen(): boolean;
    get classic(): boolean;
    get barChord(): boolean;
    get count(): number;
    setCapo(fret: number): void;
    get midiNotes(): number[];
    get lowestNote(): number;
    setNote(string: number, fret: number): void;
    hasNote(string: number): boolean;
    get median(): number;
    get contiguous(): boolean;
    get notation(): string;
    get locationString(): string;
    toString(): string;
}
declare class ChordOrderStrategy {
    distance: number;
    open: number;
    difficulty: number;
    bar: number;
    classic: number;
    noteCount: number;
    static wide(): ChordOrderStrategy;
    static open(): ChordOrderStrategy;
    static easy(): ChordOrderStrategy;
    static barChords(): ChordOrderStrategy;
    static classic(): ChordOrderStrategy;
    static boxed(): ChordOrderStrategy;
    weight(a: StringedChord | null, b: StringedChord | null): number;
}
declare class ChordList extends Array<StringedChord> {
    instrument: StringedInstrument;
    chord: ChordSpelling;
    root: number;
    constructor(instrument: StringedInstrument, chord: ChordSpelling, root: number);
    reorder(previousChord: StringedChord, strategy: ChordOrderStrategy): ChordList;
}
export interface ChordFinderOptions {
    distance: number;
    doubling: boolean;
}
export declare const chordFinder: (instrument: StringedInstrument, spelling: ChordSpelling, root: number, options: ChordFinderOptions) => ChordList;
export {};
