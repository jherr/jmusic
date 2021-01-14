export declare enum ShapeDifficulty {
    EASY = 1,
    MEDIUM = 5,
    HARD = 10
}
export declare const BAR_CHORD = 1;
export declare const CLASSIC = 2;
export declare class Shape {
    difficulty: ShapeDifficulty;
    extra: number;
    locations: number[];
    constructor(shape: number[], difficulty?: ShapeDifficulty, extra?: number);
    compare(other: Shape): {
        difficulty: number;
        match: boolean;
    };
}
export declare const SHAPES: Shape[];
export declare const compareWithKnownShapes: (shape: Shape) => {
    min: number;
    extras: number;
};
