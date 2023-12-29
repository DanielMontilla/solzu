import { describe, it, expect, expectTypeOf } from "vitest";
import { isEmpty, isNotEmpty } from "../../..";

describe("isEmpty", () => {
  it("returns true for an empty collection", () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
  });

  it("returns false for a non-empty collection", () => {
    expect(isEmpty([1])).toBe(false);
    const map = new Map();
    map.set("key", "value");
    expect(isEmpty(map)).toBe(false);
    const set = new Set();
    set.add("value");
    expect(isEmpty(set)).toBe(false);
  });

  it("should correctly identify empty collections", () => {
    expectTypeOf(isEmpty([])).toEqualTypeOf<boolean>();
    expectTypeOf(isEmpty(new Map())).toEqualTypeOf<boolean>();
    expectTypeOf(isEmpty(new Set())).toEqualTypeOf<boolean>();
  });
});

describe("isNotEmpty", () => {
  it("returns false for an empty collection", () => {
    expect(isNotEmpty([])).toBe(false);
    expect(isNotEmpty(new Map())).toBe(false);
    expect(isNotEmpty(new Set())).toBe(false);
  });

  it("returns true for a non-empty collection", () => {
    expect(isNotEmpty([1])).toBe(true);
    const map = new Map();
    map.set("key", "value");
    expect(isNotEmpty(map)).toBe(true);
    const set = new Set();
    set.add("value");
    expect(isNotEmpty(set)).toBe(true);
  });

  it("should correctly identify non-empty collections", () => {
    expectTypeOf(isNotEmpty([])).toEqualTypeOf<boolean>();
    expectTypeOf(isNotEmpty(new Map())).toEqualTypeOf<boolean>();
    expectTypeOf(isNotEmpty(new Set())).toEqualTypeOf<boolean>();
  });
});
