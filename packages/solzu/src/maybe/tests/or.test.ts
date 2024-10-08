import { describe, it, expect } from "vitest";
import { Some, None } from "..";
import { or } from "../fp";

describe("or", () => {
  it("should return the inner value when provided with Some instance", () => {
    const inner = "test";
    const some = Some(inner);

    const value = or("hello")(some);

    expect(value).toBe(inner);
  });

  it("should return the inner value when provided with Some instance", () => {
    const alteranative = "test";
    const none = None();

    const value = or(alteranative)(none);

    expect(value).toBe(alteranative);
  });
});
