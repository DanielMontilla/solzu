import { describe, it, expectTypeOf } from "vitest";
import { Result, OkOf } from "..";

describe("OkOf", () => {
  it("should correctly extract the ok value from result", () => {
    type OkValue = number;
    type ResultType = Result<OkValue, never>;
    type Test = OkOf<ResultType>;

    expectTypeOf<Test>().toMatchTypeOf<OkValue>();
  });
});
