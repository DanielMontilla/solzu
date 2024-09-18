import { describe, it, expect } from "vitest";
import { Some, isSome, None } from "..";
import { check } from "../fp";

describe("check [runtime]", () => {
  it("should return original Maybe when input is Some and predicate evaluates true", () => {
    const some = Some(5);
    const predicate = (x: number): boolean => x > 3;
    const value = check(predicate)(some);

    expect(isSome(value)).toBe(true);
    expect(value).toBe(some);
  });

  it("should return None when input is Some and predicate evaluates false", () => {
    const some = Some(5);
    const predicate = (x: number): boolean => x > 12;
    const value = check(predicate)(some);

    expect(isSome(value)).toBe(false);
  });

  it("should return original Maybe when input is None and predicate evaluates true", () => {
    const none = None();
    const predicate = (x: number): boolean => x > 3;
    const value = check(predicate)(none);

    expect(isSome(value)).toBe(false);
    expect(value).toBe(none);
  });
});
