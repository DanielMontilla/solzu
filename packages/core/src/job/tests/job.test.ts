import { describe, expect, it } from "vitest";
import { job } from "..";

describe("job [runtime]", () => {
  it("should pass", () => {
    const value = "hello";
    const op = (v: string) => `${v} world`;
    const final = op(value);

    const test = job(value, op);

    expect(test).toBe(final);
  });
});
