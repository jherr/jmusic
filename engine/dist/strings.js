"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chordFinder = exports.StringedChord = exports.StringedInstrument = exports.getTuningsByStringCount = exports.getTuningByName = exports.TUNINGS = exports.Tuning = exports.StringedInstrumentLocation = void 0;
var theory_1 = require("./theory");
var shapes_1 = require("./shapes");
var GUITAR_BASE_NOTE = 40;
var BASS_BAS_NOTE = 28;
var STANDARD_FRET_COUNT = 22;
var StringedInstrumentLocation = /** @class */ (function () {
    function StringedInstrumentLocation(string, fret) {
        this.string = string;
        this.fret = fret;
    }
    return StringedInstrumentLocation;
}());
exports.StringedInstrumentLocation = StringedInstrumentLocation;
var Tuning = /** @class */ (function () {
    function Tuning(name, intervals) {
        this.name = name;
        this.intervals = intervals;
    }
    return Tuning;
}());
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
var getTuningByName = function (n) { var _a; return (_a = exports.TUNINGS.find(function (_a) {
    var name = _a.name;
    return name === n;
})) !== null && _a !== void 0 ? _a : exports.TUNINGS[0]; };
exports.getTuningByName = getTuningByName;
var getTuningsByStringCount = function (count) {
    return exports.TUNINGS.filter(function (_a) {
        var intervals = _a.intervals;
        return intervals.length === count;
    });
};
exports.getTuningsByStringCount = getTuningsByStringCount;
var StringedInstrument = /** @class */ (function () {
    function StringedInstrument(startNote, numFrets, tuning) {
        var _this = this;
        this.startNote = startNote;
        this.numFrets = numFrets;
        this.tuningName = "";
        this.tuning = [];
        this.midiTuning = [];
        this.tuningName = tuning.name;
        var midiNoteValue = this.startNote;
        tuning.intervals.forEach(function (ti) {
            midiNoteValue += ti;
            _this.midiTuning.push(midiNoteValue);
            _this.tuning.push(theory_1.getNoteFromMIDI(midiNoteValue));
        });
    }
    Object.defineProperty(StringedInstrument, "bass", {
        get: function () {
            return new StringedInstrument(BASS_BAS_NOTE, STANDARD_FRET_COUNT, exports.getTuningByName("Bass Standard"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedInstrument, "guitar", {
        get: function () {
            return new StringedInstrument(GUITAR_BASE_NOTE, STANDARD_FRET_COUNT, exports.getTuningByName("Guitar Standard"));
        },
        enumerable: false,
        configurable: true
    });
    StringedInstrument.prototype.findNotes = function (note) {
        var _this = this;
        var locations = [];
        this.midiTuning.forEach(function (startNote, string) {
            var fret = note - (startNote % 12);
            while (fret < _this.numFrets) {
                if (fret >= 0) {
                    locations.push(new StringedInstrumentLocation(string, fret));
                }
                fret += 12;
            }
        });
        return locations;
    };
    Object.defineProperty(StringedInstrument.prototype, "numStrings", {
        get: function () {
            return this.tuning.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedInstrument.prototype, "topNotes", {
        get: function () {
            return this.midiTuning;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedInstrument.prototype, "topNames", {
        get: function () {
            return this.topNotes.map(function (n) { return theory_1.SCALE_NOTES[n % 12]; });
        },
        enumerable: false,
        configurable: true
    });
    StringedInstrument.prototype.noteAt = function (string, fret) {
        return fret !== -1 ? this.midiTuning[string] + fret : -1;
    };
    return StringedInstrument;
}());
exports.StringedInstrument = StringedInstrument;
var StringedChord = /** @class */ (function () {
    function StringedChord(instrument, notes) {
        if (notes === void 0) { notes = []; }
        this.instrument = instrument;
        this.notes = notes;
        if (this.notes.length === 0) {
            this.notes = this.instrument.midiTuning.map(function () { return -1; });
        }
        this.inversion = -1;
        this.playability = -1;
        this.extras = 0;
        this.capo = 0;
        this.calculatePlayability();
    }
    StringedChord.prototype.toShape = function () {
        return new shapes_1.Shape(this.notes);
    };
    StringedChord.prototype.calculatePlayability = function () {
        var info = shapes_1.compareWithKnownShapes(this.toShape());
        this.playability = info.min;
        this.extras = info.extras;
    };
    StringedChord.prototype.compare = function (other) {
        var _this = this;
        var diff = 0;
        other.notes.forEach(function (on, string) {
            diff += Math.abs(_this.notes[string] - on);
        });
        return diff;
    };
    StringedChord.prototype.contains = function (other) {
        var contains = true;
        this.notes.forEach(function (n, string) {
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
    };
    Object.defineProperty(StringedChord.prototype, "maxFret", {
        get: function () {
            return Math.max.apply(Math, this.notes);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedChord.prototype, "minFret", {
        get: function () {
            return Math.min.apply(Math, this.notes.filter(function (n) { return n > -1; }));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedChord.prototype, "isOpen", {
        get: function () {
            return this.maxFret - this.capo <= 6;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedChord.prototype, "hasOpen", {
        get: function () {
            return this.minFret === this.capo && this.isOpen;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedChord.prototype, "classic", {
        get: function () {
            return (this.extras & shapes_1.CLASSIC) === 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedChord.prototype, "barChord", {
        get: function () {
            return (this.extras & shapes_1.BAR_CHORD) === 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedChord.prototype, "count", {
        get: function () {
            return this.notes.filter(function (n) { return n !== -1; }).length;
        },
        enumerable: false,
        configurable: true
    });
    StringedChord.prototype.setCapo = function (fret) {
        this.capo = fret;
    };
    Object.defineProperty(StringedChord.prototype, "midiNotes", {
        get: function () {
            var _this = this;
            return this.notes.map(function (note, string) {
                return _this.instrument.noteAt(string, note);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedChord.prototype, "lowestNote", {
        get: function () {
            return Math.min.apply(Math, this.midiNotes.filter(function (n) { return n !== -1; })) % 12;
        },
        enumerable: false,
        configurable: true
    });
    StringedChord.prototype.setNote = function (string, fret) {
        this.notes[string] = fret;
        this.calculatePlayability();
    };
    StringedChord.prototype.hasNote = function (string) {
        return this.notes[string] !== -1;
    };
    Object.defineProperty(StringedChord.prototype, "median", {
        get: function () {
            var total = 0, count = 0;
            this.notes
                .filter(function (n) { return n !== -1; })
                .forEach(function (n) {
                total += n;
                count += 1;
            });
            return count > 0 ? total / count : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedChord.prototype, "contiguous", {
        get: function () {
            var ContiguousState;
            (function (ContiguousState) {
                ContiguousState[ContiguousState["Before"] = 0] = "Before";
                ContiguousState[ContiguousState["Inside"] = 1] = "Inside";
                ContiguousState[ContiguousState["Outside"] = 2] = "Outside";
            })(ContiguousState || (ContiguousState = {}));
            var state = ContiguousState.Before;
            var contig = true;
            this.notes.forEach(function (note) {
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
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedChord.prototype, "notation", {
        get: function () {
            return this.notes.map(function (n) { return n.toString().padStart(2, " "); }).join(" ");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StringedChord.prototype, "locationString", {
        get: function () {
            return this.midiNotes.join(" ");
        },
        enumerable: false,
        configurable: true
    });
    StringedChord.prototype.toString = function () {
        return this.midiNotes
            .map(function (n) {
            return n !== -1 ? theory_1.SCALE_NOTES[theory_1.getNoteFromMIDI(n)].padStart(2, " ") : "  ";
        })
            .join(" ");
    };
    return StringedChord;
}());
exports.StringedChord = StringedChord;
var ChordOrderStrategy = /** @class */ (function () {
    function ChordOrderStrategy() {
        this.distance = 10;
        this.open = 0;
        this.difficulty = 10;
        this.bar = 10;
        this.classic = 10;
        this.noteCount = 0;
    }
    ChordOrderStrategy.wide = function () {
        var stategy = new ChordOrderStrategy();
        stategy.noteCount = 2000;
        return stategy;
    };
    ChordOrderStrategy.open = function () {
        var stategy = new ChordOrderStrategy();
        stategy.open = 5000;
        stategy.noteCount = 1000;
        return stategy;
    };
    ChordOrderStrategy.easy = function () {
        var stategy = new ChordOrderStrategy();
        stategy.difficulty = 500;
        return stategy;
    };
    ChordOrderStrategy.barChords = function () {
        var stategy = new ChordOrderStrategy();
        stategy.bar = 5000;
        return stategy;
    };
    ChordOrderStrategy.classic = function () {
        var stategy = new ChordOrderStrategy();
        stategy.classic = 5000;
        return stategy;
    };
    ChordOrderStrategy.boxed = function () {
        var stategy = new ChordOrderStrategy();
        stategy.distance = 1000;
        return stategy;
    };
    ChordOrderStrategy.prototype.weight = function (a, b) {
        var _a;
        var am = a !== null ? a.median : 0;
        var bm = b !== null ? b.median : 0;
        var weight = 10000;
        weight -= Math.abs(am - bm) * this.distance;
        var open = 0;
        if (b === null || b === void 0 ? void 0 : b.isOpen) {
            open += 1;
        }
        if (b === null || b === void 0 ? void 0 : b.hasOpen) {
            open += 10;
        }
        weight -= open * this.open;
        weight -= (50 - ((b === null || b === void 0 ? void 0 : b.playability) || 50)) * this.difficulty;
        weight -= ((b === null || b === void 0 ? void 0 : b.classic) ? 1 : 0) * this.classic;
        weight -= ((b === null || b === void 0 ? void 0 : b.barChord) ? 1 : 0) * this.bar;
        weight -= ((_a = b === null || b === void 0 ? void 0 : b.count) !== null && _a !== void 0 ? _a : 0) * this.noteCount;
        return weight;
    };
    return ChordOrderStrategy;
}());
var ChordList = /** @class */ (function (_super) {
    __extends(ChordList, _super);
    function ChordList(instrument, chord, root) {
        var _this = _super.call(this) || this;
        _this.instrument = instrument;
        _this.chord = chord;
        _this.root = root;
        return _this;
    }
    ChordList.prototype.reorder = function (previousChord, strategy) {
        var weightedChords = this.map(function (chord) { return ({
            weight: strategy.weight(previousChord, chord),
            chord: chord,
        }); }).sort(function (a, b) {
            return a.weight < b.weight ? -1 : a.weight === b.weight ? 0 : 1;
        });
        var newChords = new ChordList(this.instrument, this.chord, this.root);
        weightedChords.forEach(function (_a) {
            var chord = _a.chord;
            return newChords.push(chord);
        });
        return newChords;
    };
    return ChordList;
}(Array));
var chordFinder = function (instrument, spelling, root, options) {
    var createChordList = function () { return new ChordList(instrument, spelling, root); };
    var notes = spelling.notes(root);
    var distance = (options === null || options === void 0 ? void 0 : options.distance) || 4;
    var addChords = function (chords, doubling) {
        if (doubling === void 0) { doubling = false; }
        var newChords = createChordList();
        chords.forEach(function (chord) { return newChords.push(chord); });
        notes.forEach(function (note) {
            if (newChords.length === 0) {
                instrument.findNotes(note).forEach(function (location) {
                    var chord = new StringedChord(instrument);
                    chord.setNote(location.string, location.fret);
                    newChords.push(chord);
                });
            }
            else {
                var addedChords_1 = createChordList();
                newChords.forEach(function (chord) {
                    if (doubling) {
                        addedChords_1.push(chord);
                    }
                    instrument.findNotes(note).forEach(function (location) {
                        if (!chord.hasNote(location.string)) {
                            var newChord = new StringedChord(instrument, __spreadArrays(chord.notes));
                            newChord.setNote(location.string, location.fret);
                            if (newChord.maxFret - newChord.minFret <= distance) {
                                addedChords_1.push(newChord);
                            }
                        }
                    });
                });
                newChords = addedChords_1;
            }
        });
        return newChords;
    };
    var chords = createChordList();
    chords = addChords(chords);
    if (options === null || options === void 0 ? void 0 : options.doubling) {
        chords = addChords(chords, true);
        chords = addChords(chords, true);
    }
    var duplicates = {};
    var newChords = createChordList();
    chords.forEach(function (chord) {
        var key = chord.locationString;
        if (!duplicates[key]) {
            newChords.push(chord);
        }
        duplicates[key] = true;
    });
    chords = newChords;
    chords.sort(function (a, b) { return (a.count < b.count ? 1 : a.count === b.count ? 0 : -1); });
    var superChords = createChordList();
    chords.forEach(function (chord) {
        var found = false;
        superChords.forEach(function (superChord) {
            if (superChord.contains(chord)) {
                found = true;
            }
        });
        if (!found) {
            superChords.push(chord);
        }
    });
    chords = superChords;
    chords.sort(function (a, b) {
        var diff = a.playability < b.playability
            ? -1
            : a.playability === b.playability
                ? 0
                : 1;
        if (diff === 0) {
            diff = a.minFret < b.minFret ? -1 : a.minFret === b.minFret ? 0 : 1;
        }
        return diff;
    });
    var inversionMap = spelling.inversions(root);
    chords.forEach(function (chord) {
        chord.inversion = inversionMap[chord.lowestNote];
    });
    return chords;
};
exports.chordFinder = chordFinder;
