import { describe, it, expect, expectTypeOf } from "vitest";
import { Maybe, None, SomeOf } from "..";

describe("Maybe [runtime]", () => {
  it("should return None when no argument is provided", () => {
    const value = Maybe();

    expect(value).toHaveProperty("kind", "none");
  });

  it("should return Some when argument is provided", () => {
    const inner = 0xf;
    const value = Maybe(inner);

    expect(value).toHaveProperty("kind", "some");
    expect(value).toHaveProperty("value", inner);
  });
});

describe("Maybe [types]", () => {
  it("should be Maybe<T> when no argument is provided", () => {
    const value = Maybe<Inner>();
    type Inner = number;
    type Test = typeof value;

    expectTypeOf<Test>().toMatchTypeOf<Maybe<Inner>>();
  });
  it("should be Maybe<T> when argument is provided", () => {
    const inner: string = "test";
    const value = Maybe<Inner>();
    type Inner = typeof inner;
    type Test = typeof value;

    expectTypeOf<Test>().toMatchTypeOf<Maybe<Inner>>();
  });

  describe("SomeOf", () => {
    it("should infer the inner type of maybe", () => {
      type Inner = number;
      type Value = Maybe<Inner>;
      type Test = SomeOf<Value>;

      expectTypeOf<Test>().toMatchTypeOf<Inner>();
    });

    it("should only accept maybe types", () => {
      type NotMaybe = null;

      // @ts-expect-error
      type Test = SomeOf<NotMaybe>;
    });

    it("should infer the inner type of ok", () => {
      type Inner = number;
      type Value = Maybe<Inner>;
      type Test = SomeOf<Value>;

      expectTypeOf<Test>().toMatchTypeOf<Inner>();
    });

    it("should infer never on type of none", () => {
      type Value = None;
      type Test = SomeOf<Value>;

      expectTypeOf<Test>().toMatchTypeOf<never>();
    });
  });

  describe("Flatten", () => {
    it("should infer the inner nested type @ depth 1", () => {
      type Inner = number;
      type Expected = Maybe<Inner>;
      type M1 = Maybe<Expected>;
      type Test = Maybe.Flatten<M1>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });

    it("should infer the inner nested type @ depth 2", () => {
      type Inner = number;
      type Expected = Maybe<Inner>;
      type M1 = Maybe<Expected>;
      type M2 = Maybe<M1>;
      type Test = Maybe.Flatten<M2>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });

    it("should infer the inner nested type @ depth 8", () => {
      type Inner = number;
      type Expected = Maybe<Inner>;
      type M1 = Maybe<Expected>;
      type M2 = Maybe<M1>;
      type M3 = Maybe<M2>;
      type M4 = Maybe<M3>;
      type M5 = Maybe<M4>;
      type M6 = Maybe<M5>;
      type M7 = Maybe<M6>;
      type M8 = Maybe<M7>;

      type Test = Maybe.Flatten<M8>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });

    it("should be none on none type", () => {
      type Value = None;
      type Test = Maybe.Flatten<Value>;

      expectTypeOf<Test>().toMatchTypeOf<None>();
    });

    it("should be none on nested none type @ depth 1", () => {
      type M1 = Maybe<None>;
      type Test = Maybe.Flatten<M1>;

      expectTypeOf<Test>().toMatchTypeOf<None>();
    });

    it("should be none on nested none type @ depth 2", () => {
      type M1 = Maybe<None>;
      type M2 = Maybe<M1>;
      type Test = Maybe.Flatten<M2>;

      expectTypeOf<Test>().toMatchTypeOf<None>();
    });

    it("should be none on nested none type @ depth 8", () => {
      type M1 = Maybe<None>;
      type M2 = Maybe<M1>;
      type M3 = Maybe<M2>;
      type M4 = Maybe<M3>;
      type M5 = Maybe<M4>;
      type M6 = Maybe<M5>;
      type M7 = Maybe<M6>;
      type M8 = Maybe<M7>;
      type Test = Maybe.Flatten<M8>;

      expectTypeOf<Test>().toMatchTypeOf<None>();
    });
  });
});
