"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shapes_1 = require("./shapes");
describe("Shapes", () => {
    it("Should compare against known shapes", () => {
        expect(shapes_1.compareWithKnownShapes(new shapes_1.Shape([3, -1, 0, 0, 3, 3]))).toEqual({
            min: 6,
            extras: 0,
        });
    });
    it("Should compare against known shapes", () => {
        expect(shapes_1.compareWithKnownShapes(new shapes_1.Shape([0, 0, 0, 0, 0, 0]))).toEqual({
            min: 1,
            extras: 1,
        });
    });
});
