import { describe, it, expect } from "vitest";
import { isNothing, Nothing, NOTHING_CLASSIFIER, NOTHING_SPECIFIER } from ".";
import { $CLASSIFIER, $SPECIFIER } from "../data";

describe("Nothing", () => {
  it("should match its runtime specifier w/ explicit specifier", () => {
    const value = Nothing();

    expect(value).toHaveProperty($SPECIFIER, NOTHING_SPECIFIER);
  });

  it("should match its runtime classifier w/ explicit classifier", () => {
    const value = Nothing();

    expect(value).toHaveProperty($CLASSIFIER, NOTHING_CLASSIFIER);
  });
});

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
