import { describe, it, expect } from "vitest";
import { Some, isSome, None, isNone } from "..";
import { job } from "../../job";
import { map } from "../scoped";

describe("map [runtime]", () => {
  it("should return mapped maybe's inner some value for Some inputs", () => {
    const initial = 16;
    const final = initial * 2;
    const func = (x: number) => x * 2;
    const some = Some(initial);

    const value = map(func)(some);

    expect(isSome(value)).toBe(true);
    expect(value).toHaveProperty("value", final);
  });

  it("should return none for None inputs", () => {
    const none = None();
    const func = (x: number) => x * 2;

    const value = map(func)(none);

    expect(isNone(value)).toBe(true);
  });

  describe("w/ job", () => {
    it("should return mapped maybe's inner some value for Some inputs", () => {
      const initial = 16;
      const final = initial * 2;
      const func = (x: number) => x * 2;

      const value = job(Some(initial), map(func));

      expect(isSome(value)).toBe(true);
      expect(value).toHaveProperty("value", final);
    });

    it("should return none for None inputs", () => {
      const none = None();
      const func = (x: number) => x * 2;

      const value = job(none, map(func));

      expect(isNone(value)).toBe(true);
    });
  });
});
