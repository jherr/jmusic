export declare const IONIAN_SCALE: number[];
export declare const SCALE_NOTES: string[];
export declare class CircleOfFifthsImpl {
    scales: number[][];
    constructor();
}
export declare const CircleOfFifths: CircleOfFifthsImpl;
export declare const getNoteByName: (name: string) => number;
export declare const getNoteFromMIDI: (midi: number) => number;
export declare class Scale {
    name: string;
    intervals: number[];
    constructor(name: string, intervals: number[]);
}
export declare const SCALES: Scale[];
export declare const AUGMENTS: {
    [key: string]: number;
};
export declare class Tone {
    root: number;
    augment: number;
    constructor(root: number, augment: number);
    static parse(text: string): Tone | null;
}
export declare class ChordSpelling {
    name: string;
    shortName: string | null;
    tones: Tone[];
    constructor(name: string, shortName: string | null, toneString: string);
    private note;
    notes(root: number): number[];
    inversions(root: number): {
        [note: number]: number;
    };
}
export declare const CHORDS: ChordSpelling[];
export declare const getChordByName: (name: string) => ChordSpelling | undefined;
export declare const getChordByShortName: (name: string) => ChordSpelling | undefined;
export declare const parseShortName: (shortName: string) => {
    root: number;
    chord: ChordSpelling;
} | null;
