import { describe, it, expect, expectTypeOf } from "vitest";
import { $SPECIFIER, $CLASSIFIER } from "../../../data";
import { Nothing } from "../../nothing";
import { ERR_SPECIFIER, ERR_CLASSIFIER, Err } from "..";

describe("Err [runtime]", () => {
  it("should match its runtime specifier w/ explicit specifier", () => {
    const value = Err("test");

    expect(value).toHaveProperty($SPECIFIER, ERR_SPECIFIER);
  });

  it("should match its runtime classifier w/ explicit classifier", () => {
    const value = Err("test");

    expect(value).toHaveProperty($CLASSIFIER, ERR_CLASSIFIER);
  });
  it("should return an empty Err when no argument is provided", () => {
    const value = Err();

    expect(value).toHaveProperty("error", Nothing());
  });

  it("should return a Err with inner value when argument is provided", () => {
    const inner = "test";
    const value = Err(inner);

    expect(value).toHaveProperty("error", inner);
  });
});

describe("Ok [types]", () => {
  it("should be Err<Nothing> when no argument is provided", () => {
    const value = Err();
    type Test = typeof value;

    expectTypeOf<Test>().toMatchTypeOf<Err<Nothing>>();
  });

  it("should be Err<Inner> when argument is provided", () => {
    const inner: number = 10;
    const value = Err(inner);
    type Inner = typeof inner;
    type Test = typeof value;

    expectTypeOf<Test>().toMatchTypeOf<Err<Inner>>();
  });
});
