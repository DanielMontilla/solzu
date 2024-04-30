import { expectTypeOf, describe, it } from "vitest";
import { Result, OkOf, ErrOf } from "..";

describe("Result [runtime]", () => {
  describe("OkOf", () => {
    it("should extract the Ok value from result", () => {
      type OkValue = number;
      type ResultType = Result<OkValue, never>;
      type Test = OkOf<ResultType>;

      expectTypeOf<Test>().toMatchTypeOf<OkValue>();
    });
  });

  describe("ErrOf", () => {
    it("should extract the Err value from result", () => {
      type ErrValue = number;
      type ResultType = Result<never, ErrValue>;
      type Test = ErrOf<ResultType>;

      expectTypeOf<Test>().toMatchTypeOf<ErrValue>();
    });
  });

  describe("Flatten", () => {
    it("should return the original result if not nested", () => {
      type Expected = Result<boolean, string>;
      type Test = Result.Flatten<Expected>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });

    it("should return the nested result type w/ union of Err", () => {
      type NestedOk = string;
      type NestedErr = "nested err";
      type Nested = Result<NestedOk, NestedErr>;

      type RootErr = "rootErr";
      type Root = Result<Nested, RootErr>;

      type Test = Result.Flatten<Root>;
      type Expected = Result<NestedOk, NestedErr | RootErr>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });
  });

  describe("Unfold", () => {
    it("should just return the origin result if not nested", () => {
      type Expected = Result<string, boolean>;
      type Test = Result.Unfold<Expected>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });

    it("should infer the inner nested result @ depth 1", () => {
      type InOk = number;
      type InErr = string;
      type InResult = Result<InOk, InErr>;

      type OutErr = boolean;
      type OutResult = Result<InResult, OutErr>;

      type Test = Result.Unfold<OutResult>;

      expectTypeOf<Test>().toMatchTypeOf<Result<InOk, InErr | OutErr>>();
    });

    it("should infer the inner nested result @ depth 8", () => {
      type Inner = number;

      type Err1 = "error 1";
      type Result1 = Result<Inner, Err1>;

      type Ok2 = Result1;
      type Err2 = "error 2";
      type Result2 = Result<Ok2, Err2>;

      type Ok3 = Result2;
      type Err3 = "error 3";
      type Result3 = Result<Ok3, Err4>;

      type Ok4 = Result3;
      type Err4 = "error 4";
      type Result4 = Result<Ok4, Err4>;

      type Ok5 = Result4;
      type Err5 = "error 5";
      type Result5 = Result<Ok5, Err5>;

      type Ok6 = Result5;
      type Err6 = "error 6";
      type Result6 = Result<Ok6, Err6>;

      type Ok7 = Result6;
      type Err7 = "error 7";
      type Result7 = Result<Ok7, Err7>;

      type Ok8 = Result7;
      type Err8 = "error 8";
      type Result8 = Result<Ok8, Err8>;

      type Test = Result.Unfold<Result8>;

      expectTypeOf<Test>().toMatchTypeOf<
        Result<Inner, Err1 | Err2 | Err3 | Err4 | Err5 | Err6 | Err7 | Err8>
      >();
    });
  });
});
