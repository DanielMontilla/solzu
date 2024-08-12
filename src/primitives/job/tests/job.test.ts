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

  // Additional Tests

  it("should correctly apply multiple operators in sequence", () => {
    const initial = 2;
    const operatorA = (v: number) => v + 3;
    const operatorB = (v: number) => v * 2;
    const final = operatorB(operatorA(initial));

    const value = job(initial, operatorA, operatorB);

    expect(value).toBe(final);
  });

  it("should handle functions as input values", () => {
    const initial = () => 5;
    const operator = (v: number) => v * 10;
    const final = operator(initial());

    const value = job(initial, operator);

    expect(value).toBe(final);
  });

  it("should handle string transformations with multiple operators", () => {
    const initial = "chat";
    const operatorA = (v: string) => v.toUpperCase();
    const operatorB = (v: string) => `${v}GPT`;
    const final = operatorB(operatorA(initial));

    const value = job(initial, operatorA, operatorB);

    expect(value).toBe(final);
  });

  it("should handle complex transformation chains", () => {
    const initial = { a: 1, b: 2 };
    const operatorA = (v: { a: number; b: number }) => ({ ...v, c: v.a + v.b });
    const operatorB = (v: { a: number; b: number; c: number }) => ({
      ...v,
      d: v.c * 2,
    });
    const final = operatorB(operatorA(initial));

    const value = job(initial, operatorA, operatorB);

    expect(value).toEqual(final);
  });

  it("should work correctly with array transformations", () => {
    const initial = [1, 2, 3];
    const operatorA = (v: number[]) => v.map(x => x * 2);
    const operatorB = (v: number[]) => v.filter(x => x > 4);
    const final = operatorB(operatorA(initial));

    const value = job(initial, operatorA, operatorB);

    expect(value).toEqual(final);
  });

  it("should correctly return the result when using a single operator", () => {
    const initial = 7;
    const operator = (v: number) => v * v;
    const final = operator(initial);

    const value = job(initial, operator);

    expect(value).toBe(final);
  });

  it("should correctly apply no transformation when an empty operator array is passed", () => {
    const initial = "no change";
    const final = initial;

    const value = job(initial);

    expect(value).toBe(final);
  });
});
