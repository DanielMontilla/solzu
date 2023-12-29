import { describe, it, expect, expectTypeOf } from "vitest";
import { isSet, isEmptySet, isNotEmptySet } from "../../..";
describe("isSet", () => {
  it("returns true for a Set", () => {
    expect(isSet(new Set())).toBe(true);
  });

  it("returns false for non-Set types", () => {
    expect(isSet([])).toBe(false);
    expect(isSet({})).toBe(false);
    expect(isSet("not a set")).toBe(false);
  });

  it("should correctly identify Sets", () => {
    expectTypeOf(isSet(new Set())).toEqualTypeOf<boolean>();
  });
});

describe("isEmptySet", () => {
  it("returns true for an empty set", () => {
    expect(isEmptySet(new Set())).toBe(true);
  });

  it("returns false for a non-empty set", () => {
    const set = new Set();
    set.add("value");
    expect(isEmptySet(set)).toBe(false);
  });
});

describe("isNotEmptySet", () => {
  it("returns false for an empty set", () => {
    expect(isNotEmptySet(new Set())).toBe(false);
  });

  it("returns true for a non-empty set", () => {
    const set = new Set();
    set.add("value");
    expect(isNotEmptySet(set)).toBe(true);
  });
});
