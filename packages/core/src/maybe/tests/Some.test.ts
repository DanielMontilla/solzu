import { describe, it, expect, expectTypeOf } from "vitest";
import { Some, SOME_SPECIFIER, SOME_CLASSIFIER } from "..";
import { $SPECIFIER, $CLASSIFIER } from "../../data";
import { Nothing } from "../../nothing";

describe("Some [runtime]", () => {
  it("should match its runtime specifier w/ explicit specifier", () => {
    const value = Some("test");

    expect(value).toHaveProperty($SPECIFIER, SOME_SPECIFIER);
  });

  it("should match its runtime classifier w/ explicit classifier", () => {
    const value = Some("test");

    expect(value).toHaveProperty($CLASSIFIER, SOME_CLASSIFIER);
  });
  it("should return an empty some when no argument is provided", () => {
    const value = Some();

    expect(value).toHaveProperty("value", Nothing());
  });

  it("should return a Some with inner value when argument is provided", () => {
    const inner = "test";
    const value = Some(inner);

    expect(value).toHaveProperty("value", inner);
  });
});

describe("Some [types]", () => {
  it("should be Some<Nothing> when no argument is provided", () => {
    const value = Some();
    type Test = typeof value;

    expectTypeOf<Test>().toMatchTypeOf<Some<Nothing>>();
  });

  it("should be Some<Inner> when argument is provided", () => {
    const inner: number = 10;
    const value = Some(inner);
    type Inner = typeof inner;
    type Test = typeof value;

    expectTypeOf<Test>().toMatchTypeOf<Some<Inner>>();
  });
});
