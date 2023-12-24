import {
  isNumber,
  isInt,
  isFloat,
  gt,
  gte,
  lt,
  lte,
  isNegative,
  isNonNegative,
  isPositive,
  isNonPositive,
  tryParseNumber,
} from ".";

import { describe, it, expect } from "vitest";

describe("numberUtils", () => {
  it("isNumber", () => {
    expect(isNumber(5)).toBe(true);
    expect(isNumber(-2)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(1000_1000.1)).toBe(true);
    expect(isNumber("5")).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber(NaN)).toBe(false);
  });

  it("isInt", () => {
    expect(isInt(5)).toBe(true);
    expect(isInt(-100)).toBe(true);
    expect(isInt(0)).toBe(true);
    expect(isInt(5.5)).toBe(false);
    expect(isInt(NaN)).toBe(false);
    expect(isInt(Infinity)).toBe(false);
  });

  it("isFloat", () => {
    expect(isFloat(5.5)).toBe(true);
    expect(isFloat(-3.14)).toBe(true);
    expect(isFloat(5)).toBe(false);
    expect(isFloat(-2)).toBe(false);
    expect(isFloat(NaN)).toBe(false);
  });

  it("gt", () => {
    expect(gt(5)(10)).toBe(true); // 10 > 5
    expect(gt(5)(2)).toBe(false); // 2 is not > 5
  });

  it("gte", () => {
    expect(gte(5)(5)).toBe(true); // 5 is >= 5
    expect(gte(5)(6)).toBe(true); // 6 is >= 5
    expect(gte(5)(4)).toBe(false); // 4 is not >= 5
  });

  it("lt", () => {
    expect(lt(5)(3)).toBe(true); // 3 < 5
    expect(lt(5)(5)).toBe(false); // 5 is not < 5
    expect(lt(5)(6)).toBe(false); // 6 is not < 5
  });

  it("lte", () => {
    expect(lte(5)(5)).toBe(true); // 5 is <= 5
    expect(lte(5)(4)).toBe(true); // 4 is <= 5
    expect(lte(5)(6)).toBe(false); // 6 is not <= 5
  });

  it("isPositive", () => {
    expect(isPositive(1)).toBe(true);
    expect(isPositive(0.1)).toBe(true);
    expect(isPositive(0)).toBe(false);
    expect(isPositive(-1)).toBe(false);
  });

  it("isNegative", () => {
    expect(isNegative(-1)).toBe(true);
    expect(isNegative(-0.1)).toBe(true);
    expect(isNegative(0)).toBe(false);
    expect(isNegative(1)).toBe(false);
  });

  it("isNonNegative", () => {
    expect(isNonNegative(1)).toBe(true);
    expect(isNonNegative(0)).toBe(true);
    expect(isNonNegative(-0.1)).toBe(false);
    expect(isNonNegative(-1)).toBe(false);
  });

  it("isNonePositive", () => {
    expect(isNonPositive(-1)).toBe(true);
    expect(isNonPositive(0)).toBe(true);
    expect(isNonPositive(0.1)).toBe(false);
    expect(isNonPositive(1)).toBe(false);
  });

  it("tryParseNumber", () => {
    const validValues = [
      [1, 1],
      ["50", 50],
      ["1.2345", 1.2345],
      [0xfff, 0xfff],
      ["         3.14 ", 3.14],
      ["1023.1f0101", 1023.1], // TODO: make this fail
    ];
    for (const [value, expected] of validValues) {
      expect(tryParseNumber(value).take).not.throw;
      expect(tryParseNumber(value).take()).toBe(expected);
    }
    const invalidValues = [null, NaN, "Daniel", {}];
    for (const value of invalidValues) {
      const res = tryParseNumber(value);
      expect(res.isNone()).toBe(true);
    }
  });
});
