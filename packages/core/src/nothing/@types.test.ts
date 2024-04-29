import { describe, it, expectTypeOf } from "vitest";
import { Nothing, NOTHING_SPECIFIER } from ".";

describe("Nothing", () => {
  it("kind should match specifier", () => {
    type Test = typeof NOTHING_SPECIFIER;

    expectTypeOf<Test>().toMatchTypeOf<Nothing["kind"]>();
  });
});
