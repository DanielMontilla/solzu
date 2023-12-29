import { describe, it, expect, expectTypeOf } from "vitest";
import { isArray, isEmptyArray, isNotEmptyArray } from "../../..";

describe("isArray", () => {
  it("returns true for an array", () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
  });

  it("returns false for non-array types", () => {
    expect(isArray("not an array")).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray(123)).toBe(false);
  });

  it("should correctly identify arrays", () => {
    expectTypeOf(isArray([])).toEqualTypeOf<boolean>();
    expectTypeOf(isArray([1, 2, 3])).toEqualTypeOf<boolean>();
    expectTypeOf(isArray("not an array")).toEqualTypeOf<boolean>();
    expectTypeOf(isArray({})).toEqualTypeOf<boolean>();
  });
});

describe("isEmptyArray", () => {
  it("returns true for an empty array", () => {
    expect(isEmptyArray([])).toBe(true);
  });

  it("returns false for a non-empty array", () => {
    expect(isEmptyArray([1])).toBe(false);
    expect(isEmptyArray([1, 2, 3])).toBe(false);
  });

  it("should correctly identify empty arrays", () => {
    expectTypeOf(isEmptyArray([])).toEqualTypeOf<boolean>();
    expectTypeOf(isEmptyArray([1])).toEqualTypeOf<boolean>();
  });
});

describe("isNotEmptyArray", () => {
  it("returns false for an empty array", () => {
    expect(isNotEmptyArray([])).toBe(false);
  });

  it("returns true for a non-empty array", () => {
    expect(isNotEmptyArray([1])).toBe(true);
    expect(isNotEmptyArray([1, 2, 3])).toBe(true);
  });

  it("should correctly identify non-empty arrays", () => {
    expectTypeOf(isNotEmptyArray([])).toEqualTypeOf<boolean>();
    expectTypeOf(isNotEmptyArray([1])).toEqualTypeOf<boolean>();
  });
});
