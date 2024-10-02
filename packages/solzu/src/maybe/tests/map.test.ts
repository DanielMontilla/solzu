import { describe, it, expect, expectTypeOf } from "vitest";
import { Some, isSome, None, isNone, Maybe } from "..";
import { map } from "../fp";
import { pipe } from "../../pipe";

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

      const value = pipe(Some(initial), map(func));

      expect(isSome(value)).toBe(true);
      expect(value).toHaveProperty("value", final);
    });

    it("should return none for None inputs", () => {
      const none = None();
      const func = (x: number) => x * 2;

      const value = pipe(none, map(func));

      expect(isNone(value)).toBe(true);
    });
  });
});

describe("map [types]", () => {
  it("should return new mapped Maybe type", () => {
    const inner = 10;
    const some = Some(inner);
    const mapper = (x: number): string => `${x}`;

    const value = pipe(some, map(mapper));

    type Test = typeof value;
    type Expected = Maybe<string>;

    expectTypeOf<Test>().toMatchTypeOf<Expected>();
  });
});