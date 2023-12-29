import { describe, it, expect, expectTypeOf } from "vitest";
import { isMap, isEmptyMap, isNotEmptyMap } from "../../..";

describe("isMap", () => {
  it("returns true for a Map", () => {
    expect(isMap(new Map())).toBe(true);
  });

  it("returns false for non-Map types", () => {
    expect(isMap([])).toBe(false);
    expect(isMap({})).toBe(false);
    expect(isMap("not a map")).toBe(false);
  });

  it("should correctly identify Maps", () => {
    expectTypeOf(isMap(new Map())).toEqualTypeOf<boolean>();
  });
});

describe("isEmptyMap", () => {
  it("returns true for an empty map", () => {
    expect(isEmptyMap(new Map())).toBe(true);
  });

  it("returns false for a non-empty map", () => {
    const map = new Map();
    map.set("key", "value");
    expect(isEmptyMap(map)).toBe(false);
  });
});

describe("isNotEmptyMap", () => {
  it("returns false for an empty map", () => {
    expect(isNotEmptyMap(new Map())).toBe(false);
  });

  it("returns true for a non-empty map", () => {
    const map = new Map();
    map.set("key", "value");
    expect(isNotEmptyMap(map)).toBe(true);
  });
});
