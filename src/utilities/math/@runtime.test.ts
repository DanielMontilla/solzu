import { describe, it, expect } from "vitest";
import { Err, lerp } from "../..";

describe("lerp", () => {
  it("should return error when given invalid range", () => {
    const result = lerp(0, -1, 0);
    expect(result).toBeInstanceOf(Err);
    expect(result.takeErr()).toBe(lerp.Error.InvalidRange);
  });

  it("should return error when give invalid factor", () => {
    const result = lerp(0, 5, -1);
    expect(result).toBeInstanceOf(Err);
    expect(result.takeErr()).toBe(lerp.Error.InvalidFactor);
  });

  describe("unsafe", () => {
    it("should retur correct result", () => {
      expect(lerp.unsafe(0, 10, 0.5)).toBe(5);
      expect(lerp.unsafe(10, 20, 1)).toBe(20);
      expect(lerp.unsafe(-10, 10, 0)).toBe(-10);
    });
  });
});
