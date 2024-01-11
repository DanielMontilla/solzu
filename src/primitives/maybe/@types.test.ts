import { describe, test, expectTypeOf } from "vitest";
import { Maybe, Some, None } from "./";

const inner: number = 0;
type Inner = typeof inner;

const maybe: Maybe<Inner> = Maybe.Some(inner).toUnion();
type TestMaybe = typeof maybe;

const some: Some<Inner> = Maybe.Some(inner);
type TestSome = typeof some;

const none: None = Maybe.None();
type TestNone = typeof none;

describe(".take", () => {
  test("Maybe", () => {
    type Test = ReturnType<TestMaybe["take"]>;
    type Expected = Inner;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Some", () => {
    type Test = ReturnType<TestSome["take"]>;
    type Expected = Inner;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("None", () => {
    type Test = ReturnType<TestNone["take"]>;
    type Expected = never;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });
});

describe(".map", () => {
  type MapperReturn = string;
  const mapper = (x: Inner): MapperReturn => String(x);

  test("Maybe", () => {
    const test = maybe.map(mapper);

    type Test = typeof test;
    type Expected = Maybe<MapperReturn>;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Some", () => {
    const test = some.map(mapper);

    type Test = typeof test;
    type Expected = Some<MapperReturn>;

    expectTypeOf<Test>().toMatchTypeOf<Expected>();
  });

  test("None", () => {
    const test = none.map(mapper);

    type Test = typeof test;
    type Expected = TestNone;

    expectTypeOf<Test>().toMatchTypeOf<Expected>();
  });
});
