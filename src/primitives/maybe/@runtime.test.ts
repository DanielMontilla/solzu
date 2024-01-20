import { describe, it, expect } from "vitest";
import {
  maybe,
  none,
  noneMaybe,
  some,
  someInner,
  someMaybe,
} from "./@common.test";
import { Maybe } from ".";

describe(".take", () => {
  describe("Maybe", () => {
    it("should return the inner value when called on Some instance", () => {
      expect(() => someMaybe.take()).not.toThrow();
      expect(someMaybe.take()).toBe(someInner);
    });
    it("should error when called on None instance", () => {
      expect(() => noneMaybe.take()).toThrowError(Maybe.ERROR.take);
    });
  });

  describe("Some", () => {
    it("should return inner value", () => {
      expect(some.take()).toBe(someInner);
    });
  });

  describe("None", () => {
    it("should throw error", () => {
      expect(() => none.take()).toThrowError(Maybe.ERROR.take);
    });
  });
});
