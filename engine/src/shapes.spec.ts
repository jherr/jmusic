import { Shape, compareWithKnownShapes } from "./shapes";

describe("Shapes", () => {
  it("Should compare against known shapes", () => {
    expect(compareWithKnownShapes(new Shape([3, -1, 0, 0, 3, 3]))).toEqual({
      min: 6,
      extras: 0,
    });
  });

  it("Should compare against known shapes", () => {
    expect(compareWithKnownShapes(new Shape([0, 0, 0, 0, 0, 0]))).toEqual({
      min: 1,
      extras: 1,
    });
  });
});
