"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const index_1 = require("./src/index");
const createCache = () => {
    index_1.CHORDS.forEach((chord) => {
        for (let root = 0; root < 12; root++) {
            const instrument = index_1.StringedInstrument.guitar;
            const name = ["guitar", instrument.tuningName, chord.name, root].join("_");
            console.log(name);
            const path = `../cache/${name}.json`;
            if (!fs.existsSync(path)) {
                const chords = index_1.chordFinder(instrument, chord, root, {
                    doubling: true,
                    distance: 4,
                });
                fs.writeFileSync(path, JSON.stringify({
                    version: 1,
                    chords: chords.map((c) => ({
                        notes: c.notes,
                        inversion: c.inversion,
                        playability: c.playability,
                        extras: c.extras,
                    })),
                }));
            }
        }
    });
};
createCache();
