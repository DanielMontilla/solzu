import { describe, it, expect, expectTypeOf } from "vitest";
import { Nothing, NOTHING_SPECIFIER, NOTHING_CLASSIFIER } from "..";
import { $SPECIFIER, $CLASSIFIER } from "../../data";

describe("Nothing [runtime]", () => {
  it("should match its runtime specifier w/ explicit specifier", () => {
    const value = Nothing();

    expect(value).toHaveProperty($SPECIFIER, NOTHING_SPECIFIER);
  });

  it("should match its runtime classifier w/ explicit classifier", () => {
    const value = Nothing();

    expect(value).toHaveProperty($CLASSIFIER, NOTHING_CLASSIFIER);
  });
});

describe("Nothing [types]", () => {
  it("kind should match specifier", () => {
    type Test = typeof NOTHING_SPECIFIER;

    expectTypeOf<Test>().toMatchTypeOf<Nothing["kind"]>();
  });
});
