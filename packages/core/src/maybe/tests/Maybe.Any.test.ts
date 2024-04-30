import { describe, it, expectTypeOf } from "vitest";
import { Maybe, None, Some } from "..";
import { Nothing } from "../../nothing";

describe("Maybe.Any [types]", () => {
  it("should extend empty maybe", () => {
    type Value = Maybe<Nothing>;

    type Test = Value extends Maybe.Any ? true : false;

    expectTypeOf<Test>().toMatchTypeOf<true>();
  });

  it("should extends to a variety of maybes", () => {
    type Value01 = Maybe<number>;
    type Value02 = Maybe<"true">;
    type Value03 = Maybe<{ a: string; b: boolean }>;
    type Value04 = Maybe<null>;
    type Value05 = Maybe<unknown>;

    type TestOf<T> = T extends Maybe.Any ? true : false;

    expectTypeOf<TestOf<Value01>>().toMatchTypeOf<true>();
    expectTypeOf<TestOf<Value02>>().toMatchTypeOf<true>();
    expectTypeOf<TestOf<Value03>>().toMatchTypeOf<true>();
    expectTypeOf<TestOf<Value04>>().toMatchTypeOf<true>();
    expectTypeOf<TestOf<Value05>>().toMatchTypeOf<true>();
  });

  it("should extends any Some", () => {
    type Some01 = Some<number>;
    type Some02 = Some<string>;
    type Some03 = Some<Error>;
    type Some04 = Some<undefined>;
    type Some05 = Some<unknown>;

    type TestOf<T> = T extends Maybe.Any ? true : false;

    expectTypeOf<TestOf<Some01>>().toMatchTypeOf<true>();
    expectTypeOf<TestOf<Some02>>().toMatchTypeOf<true>();
    expectTypeOf<TestOf<Some03>>().toMatchTypeOf<true>();
    expectTypeOf<TestOf<Some04>>().toMatchTypeOf<true>();
    expectTypeOf<TestOf<Some05>>().toMatchTypeOf<true>();
  });

  it("should extends None", () => {
    type Value = None;

    type Test = Value extends Maybe.Any ? true : false;

    expectTypeOf<Test>().toMatchTypeOf<true>();
  });
});
