import { describe, it, expectTypeOf, expect } from "vitest";
import { None, NONE_CLASSIFIER, NONE_SPECIFIER } from "..";
import { $SPECIFIER, $CLASSIFIER } from "../../../data";

describe("None [runtime]", () => {
  it("should return None", () => {
    const value = None();

    expect(value).toHaveProperty("kind", "none");
  });

  it("should be identical to other None instances", () => {
    const a = None();
    const b = None();

    expect(a).toBe(b);
  });

  it("should match its runtime specifier w/ explicit specifier", () => {
    const value = None();

    expect(value).toHaveProperty($SPECIFIER, NONE_SPECIFIER);
  });

  it("should match its runtime classifier w/ explicit classifier", () => {
    const value = None();

    expect(value).toHaveProperty($CLASSIFIER, NONE_CLASSIFIER);
  });
});

describe("None [types]", () => {
  it("should be None always", () => {
    const value = None();
    type Test = typeof value;

    expectTypeOf<Test>().toMatchTypeOf<None>();
  });
});
