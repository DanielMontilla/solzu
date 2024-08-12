import { describe, expect } from "vitest";
import { task } from "..";

describe.concurrent("task [runtime]", it => {
  it("should return the original value when no operator is provided", async () => {
    const initial = 42;

    const value = await task(initial);

    expect(value).toBe(initial);
  });

  it("should apply a single synchronous operator", async () => {
    const initial = 10;
    const operator = (v: number) => v * 2;
    const final = operator(initial);

    const value = await task(initial, operator);

    expect(value).toBe(final);
  });

  it("should apply a single asynchronous operator", async () => {
    const initial = 10;
    const operator = async (v: number) => v * 3;
    const final = await operator(initial);

    const value = await task(initial, operator);

    expect(value).toBe(final);
  });

  it("should handle a promise as input value", async () => {
    const initial = Promise.resolve(15);
    const operator = (v: number) => v + 5;
    const final = operator(await initial);

    const value = await task(initial, operator);

    expect(value).toBe(final);
  });

  it("should correctly apply multiple synchronous operators in sequence", async () => {
    const initial = "foo";
    const operatorA = (v: string) => `${v}bar`;
    const operatorB = (v: string) => `${v}baz`;
    const final = operatorB(operatorA(initial));

    const value = await task(initial, operatorA, operatorB);

    expect(value).toBe(final);
  });

  it("should correctly apply multiple asynchronous operators in sequence", async () => {
    const initial = 5;
    const operatorA = async (v: number) => v + 10;
    const operatorB = async (v: number) => v * 2;
    const final = await operatorB(await operatorA(initial));

    const value = await task(initial, operatorA, operatorB);

    expect(value).toBe(final);
  });

  it("should handle a mix of synchronous and asynchronous operators", async () => {
    const initial = 7;
    const operatorA = (v: number) => v + 3;
    const operatorB = async (v: number) => v * 2;
    const final = await operatorB(operatorA(initial));

    const value = await task(initial, operatorA, operatorB);

    expect(value).toBe(final);
  });

  it("should handle functions as input values", async () => {
    const initial = () => 9;
    const operator = async (v: number) => v + 1;
    const final = await operator(initial());

    const value = await task(initial, operator);

    expect(value).toBe(final);
  });

  it("should handle complex transformation chains with mixed operators", async () => {
    const initial = { x: 1, y: 2 };
    const operatorA = (v: { x: number; y: number }) => ({ ...v, z: v.x + v.y });
    const operatorB = async (v: { x: number; y: number; z: number }) => ({
      ...v,
      w: v.z * 3,
    });
    const final = await operatorB(operatorA(initial));

    const value = await task(initial, operatorA, operatorB);

    expect(value).toEqual(final);
  });

  it("should correctly return the result when using a single async operator", async () => {
    const initial = 4;
    const operator = async (v: number) => v ** 2;
    const final = await operator(initial);

    const value = await task(initial, operator);

    expect(value).toBe(final);
  });
});
