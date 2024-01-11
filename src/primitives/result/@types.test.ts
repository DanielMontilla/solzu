import { describe, test, expectTypeOf } from "vitest";
import { ErrInner, ErrTest, OkInner, OkTest, ResultTest } from "./@common.test";
import { Never } from "../..";

describe(".take", () => {
  test("Result", () => {
    type Test = ReturnType<ResultTest["take"]>;
    type Expected = OkInner;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Ok", () => {
    type Test = ReturnType<OkTest["take"]>;
    type Expected = OkInner;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Err", () => {
    type Test = ReturnType<ErrTest["take"]>;
    type Expected = Never;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });
});

describe(".takeErr", () => {
  test("Result", () => {
    type Test = ReturnType<ResultTest["takeErr"]>;
    type Expected = ErrInner;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Ok", () => {
    type Test = ReturnType<OkTest["takeErr"]>;
    type Expected = Never;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Err", () => {
    type Test = ReturnType<ErrTest["takeErr"]>;
    type Expected = ErrInner;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });
});

// describe(".method", () => {
// describe("type", () => {
//   test("Result", () => {})
//   test("Ok", () => {});
//   test("Err", () => {});
// });
