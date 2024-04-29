import { describe, it, expect } from "vitest";
import { Some, None } from "..";
import { take, TakeError } from "../scoped";

describe("take", () => {
  it("should extract inner value of some when provided with Some instance", () => {
    const inner = 10;
    const some = Some(inner);

    const value = take()(some);

    expect(value).toBe(inner);
  });

  it("should throw TakeError when provided with None instance", () => {
    const none = None();
    const callback = () => take()(none);

    expect(callback).toThrow(TakeError);
  });
});
