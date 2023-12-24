import { describe, it, expect } from "vitest";
import { Result } from ".";

describe("Result", () => {
  it("Ok", () => {
    const ok1 = Result.Ok();
    expect(ok1.takeErr).toThrowError();
    expect(ok1.takeOk()).toBe(undefined);

    const value = 0;
    const ok2 = Result.Ok(value);
    expect(ok2.value).toBe(value);
  });
});
