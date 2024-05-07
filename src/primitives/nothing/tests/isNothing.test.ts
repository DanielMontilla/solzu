import { describe, it, expect } from "vitest";
import { Nothing, isNothing } from "..";
import { $SPECIFIER, $CLASSIFIER } from "../../../data";

describe("isNothing", () => {
  it("should return true for Nothing instance", () => {
    const nothing = Nothing();
    const value = isNothing(nothing);

    expect(value).toBe(true);
  });

  it("should return false for null", () => {
    const nothing = null;
    const value = isNothing(nothing);

    expect(value).toBe(false);
  });

  it("should return false for undefined", () => {
    const nothing = undefined;
    const value = isNothing(nothing);

    expect(value).toBe(false);
  });

  it("should return false for empty object", () => {
    const nothing = {};
    const value = isNothing(nothing);

    expect(value).toBe(false);
  });

  it("should return false for an object mimicking Nothing without correct symbols", () => {
    const nothing = {
      [$SPECIFIER]: "none",
      [$CLASSIFIER]: Symbol("solzu:core@nothing"),
    };
    const value = isNothing(nothing);

    expect(value).toBe(false);
  });
});
