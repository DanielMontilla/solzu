import { describe, expect, expectTypeOf, it } from "vitest";
import { None, isNone, Some, Maybe } from "..";

describe("isNone [runtime]", () => {
  it("should return true when None is passed in", () => {
    const none = None();
    const value = isNone(none);

    expect(value).toBe(true);
  });

  it("should return false when Some is passed in", () => {
    const some = Some();
    const value = isNone(some);

    expect(value).toBe(false);
  });
});

describe("isNone [types]", () => {
  it("should narrow type via control flow inference", () => {
    const value: Maybe<number> = Maybe(10);

    if (isNone(value)) {
      expectTypeOf<typeof value>().toMatchTypeOf<None>();
    }

    if (!isNone(value)) {
      expectTypeOf<typeof value>().toMatchTypeOf<Some<number>>();
    }
  });
});
