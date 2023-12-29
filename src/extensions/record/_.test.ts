import { describe, it, expect } from "vitest";
import {
  Entries,
  entriesOf,
  keysOf,
  recordFrom,
  recordFromArray,
  recordFromEntries,
  recordFromMap,
  recordFromSet,
  valuesOf,
  hasProperty,
  isRecord,
} from "../..";

describe("Object Utilities", () => {
  describe("keysOf(object)", () => {
    it("should return an array of keys from the provided object", () => {
      const obj = { a: 1, b: "text", c: true };
      const result = keysOf(obj);
      expect(result).toEqual(["a", "b", "c"]);
    });
  });

  describe("valuesOf(object)", () => {
    it("should return an array of values from the provided object", () => {
      const obj = { a: 1, b: "text", c: true };
      const result = valuesOf(obj);
      expect(result).toEqual([1, "text", true]);
    });
  });

  describe("entriesOf(object)", () => {
    it("should return an array of key-value pairs from the provided object", () => {
      const obj = { a: 1, b: "text" };
      const result = entriesOf(obj);
      expect(result).toEqual([
        ["a", 1],
        ["b", "text"],
      ]);
    });
  });

  describe("recordFromEntries", () => {
    it("should convert entries to a record", () => {
      const entries: Entries<string, number> = [
        ["a", 1],
        ["b", 2],
      ];
      const result = recordFromEntries(entries);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe("recordFromMap", () => {
    it("should convert a map to a record", () => {
      const map = new Map([
        ["a", 1],
        ["b", 2],
      ]);
      const result = recordFromMap(map);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe("recordFromArray", () => {
    it("should convert an array to a record with indices as keys", () => {
      const array = ["hello", "world"];
      const result = recordFromArray(array);
      expect(result).toEqual({ 0: "hello", 1: "world" });
    });
  });

  describe("recordFromSet", () => {
    it("should convert a set to a record with sequential indices as keys", () => {
      const set = new Set(["hello", "world"]);
      const result = recordFromSet(set);
      expect(result).toEqual({ 0: "hello", 1: "world" });
    });
  });

  describe("recordFrom", () => {
    it("should convert entries to a record", () => {
      const entries: Entries<string, number> = [
        ["a", 1],
        ["b", 2],
      ];
      const result = recordFrom(entries);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it("should convert a map to a record", () => {
      const map = new Map([
        ["a", 1],
        ["b", 2],
      ]);
      const result = recordFrom(map);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it("should convert a set to a record", () => {
      const set = new Set(["hello", "world"]);
      const result = recordFrom(set);
      expect(result).toEqual({ 0: "hello", 1: "world" });
    });
  });

  describe("hasProperty", () => {
    describe("with objects", () => {
      it("should return true if the key exists in the object", () => {
        const obj = { a: 1, b: 2 };
        expect(hasProperty(obj, "a")).toBe(true);
        expect(hasProperty(obj, "b")).toBe(true);
      });

      it("should return false if the key does not exist in the object", () => {
        const obj = { a: 1, b: 2 };
        expect(hasProperty(obj, "c")).toBe(false);
      });
    });

    describe("with arrays", () => {
      it("should return true if the index exists in the array", () => {
        const array = ["hello", "world"];
        expect(hasProperty(array, 0)).toBe(true);
        expect(hasProperty(array, 1)).toBe(true);
      });

      it("should return false if the index does not exist in the array", () => {
        const array = ["hello", "world"];
        expect(hasProperty(array, 2)).toBe(false);
      });
    });

    describe("with maps", () => {
      it("should return true if the key exists in the map", () => {
        const map = new Map([
          ["a", 1],
          ["b", 2],
        ]);
        expect(hasProperty(Object.fromEntries(map), "a")).toBe(true);
        expect(hasProperty(Object.fromEntries(map), "b")).toBe(true);
      });

      it("should return false if the key does not exist in the map", () => {
        const map = new Map([
          ["a", 1],
          ["b", 2],
        ]);
        expect(hasProperty(Object.fromEntries(map), "c")).toBe(false);
      });
    });
  });

  describe("isRecord", () => {
    it("should return true for plain objects", () => {
      expect(isRecord({ a: 1, b: "test" })).toBe(true);
      expect(isRecord({})).toBe(true);
    });

    it("should return false for arrays", () => {
      expect(isRecord([1, 2, 3])).toBe(false);
    });

    it("should return false for class instances", () => {
      class MyClass {}
      expect(isRecord(new MyClass())).toBe(false);
    });

    it("should return false for null", () => {
      expect(isRecord(null)).toBe(false);
    });

    it("should return false for other types", () => {
      expect(isRecord(123)).toBe(false);
      expect(isRecord("string")).toBe(false);
      expect(isRecord(undefined)).toBe(false);
      expect(isRecord(function () {})).toBe(false);
    });
  });
});
