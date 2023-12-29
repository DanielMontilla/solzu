import { describe, it, expect } from "vitest";
import { isFunction } from "../..";

describe("isFunction", () => {
  it("returns true for standard functions", () => {
    const func = function () {};
    expect(isFunction(func)).toBe(true);
  });

  it("returns true for arrow functions", () => {
    const arrowFunc = () => {};
    expect(isFunction(arrowFunc)).toBe(true);
  });

  it("returns true for async functions", async () => {
    const asyncFunc = async () => {};
    expect(isFunction(asyncFunc)).toBe(true);
  });

  it("returns false for non-function values", () => {
    const values = [
      undefined,
      null,
      123,
      "string",
      {},
      [],
      new Date(),
      /regex/,
    ];
    values.forEach(value => {
      expect(isFunction(value)).toBe(false);
    });
  });

  it("returns false for class instances", () => {
    class MyClass {}
    const instance = new MyClass();
    expect(isFunction(instance)).toBe(false);
  });

  it("returns true for class (as they are technically functions)", () => {
    class MyClass {}
    expect(isFunction(MyClass)).toBe(true);
  });

  it("returns false for object with callable syntax", () => {
    const obj = {
      callMe() {
        console.log("Maybe!");
      },
    };
    expect(isFunction(obj.callMe)).toBe(true);
    expect(isFunction(obj)).toBe(false);
  });
});
