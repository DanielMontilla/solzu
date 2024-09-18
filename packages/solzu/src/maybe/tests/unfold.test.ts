import { describe, it, expect } from "vitest";
import { Some, isSome, Maybe, None, isNone } from "..";
import { unfold, MAX_UNFOLD_DEPTH } from "../fp";

describe("unfold [runtime]", () => {
  it("should return the original Some when provided with Some of depth 1", () => {
    const inner = 0xfafa;
    const some = Some(inner);

    const value = unfold()(some);

    expect(isSome(value)).toBe(true);
    expect(value).toHaveProperty("value", inner);
  });

  it("should return the unwraped maybe when provided with Some of depth n <= MAX_UNFOLD_DEPTH", () => {
    const inner = "inner";
    const run = (n: number) => {
      let some: Maybe<any> = Some(inner);

      for (let i = 0; i < n; i++) {
        some = Some(some);
      }

      const value = unfold()(some);

      expect(isSome(value)).toBe(true);
      expect(value).toHaveProperty("value", inner);
    };

    for (let i = 1; i <= MAX_UNFOLD_DEPTH; i++) run(i);
  });

  it("should return the original None when provided with None", () => {
    const none = None();

    const value = unfold()(none);

    expect(isNone(value)).toBe(true);
  });

  it("should return None on nested maybe with inner None", () => {
    const maybe = Maybe(Maybe(Maybe(Maybe(None()))));

    const value = unfold()(maybe);

    expect(isNone(value)).toBe(true);
  });
});
