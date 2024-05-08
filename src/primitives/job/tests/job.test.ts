import { describe, expect, it } from "vitest";
import { job } from "..";

describe("job [runtime]", () => {
  it("should pass", () => {
    const initial = "hello";
    const operator = (v: string) => `${v} world`;
    const final = operator(initial);

    const value = job(initial, operator);

    expect(value).toBe(final);
  });

  it("should return original when only input value is passed", () => {
    const initial = 10;
    const final = initial;

    const value = job(initial);

    expect(value).toBe(final);
  });
});
