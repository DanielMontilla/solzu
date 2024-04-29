import { expectTypeOf, describe, it } from "vitest";
import { isOk, OkOf, Result, Ok, Err, isErr } from ".";
import * as R from "./scoped";

describe("OkOf", () => {
  it("should correctly extract the ok value from result", () => {
    type OkValue = number;
    type ResultType = Result<OkValue, never>;
    type Test = OkOf<ResultType>;

    expectTypeOf<Test>().toMatchTypeOf<OkValue>();
  });
});

describe("isOk", () => {
  it("should infer err when not ok", () => {
    type ErrType = string;
    type ResultType = Result<any, ErrType>;

    try {
      let result!: ResultType;
      if (isOk(result)) {
        return;
      }
      expectTypeOf(result).toMatchTypeOf<Err<ErrType>>();
    } catch {}
  });
});

describe("isErr", () => {
  it("should infer ok when not error", () => {
    type OkType = number;
    type ResultType = Result<OkType>;

    try {
      let result!: ResultType;
      if (isErr(result)) return;
      expectTypeOf(result).toMatchTypeOf<Ok<OkType>>();
    } catch {}
  });
});

describe("map", () => {
  it("should do someting", () => {
    R.map;
  });
});
