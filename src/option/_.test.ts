import { describe, it } from "vitest";
import { Option } from ".";
import { expect } from "vitest";
import { isNumber, isPositive } from "../number";

describe("Option", () => {
  it("Some.take", () => {
    const value = 0;
    const opt = Option.Pure(value);
    expect(opt.take()).toBe(value);
  });

  it("None.take", () => {
    const opt = Option.Pure();
    expect(opt.take).toThrowError();
  });

  it("Some.takeWith", () => {
    const initial = 0;
    const value = Option.Some(initial);
    expect(value.takeWith).not.throw;
    expect(value.takeWith(Error("my error"))).toBe(initial);
  });

  it("None.takeWith", () => {
    const error1 = "my error";
    const value1 = Option.None();
    expect(value1.takeWith).throw;
    expect(() => value1.takeWith(error1)).toThrow(error1);

    const error2 = Error("my other error");
    const value2 = Option.None();
    expect(value2.takeWith).throw;
    expect(() => value2.takeWith(error2)).toThrow(error2);
  });

  it("Some.isSome/isNone", () => {
    const value = 0;
    const opt = Option.Pure(value);
    expect(opt.isSome()).toBe(true);
    expect(opt.isNone()).toBe(false);
  });

  it("None.isSome/isNone", () => {
    const opt = Option.Pure();
    expect(opt.isSome()).toBe(false);
    expect(opt.isNone()).toBe(true);
  });

  it("Some.onSome/onNone", () => {
    const value = 5;
    const opt = Option.Pure(value);

    let foo = 0;

    opt.onSome(v => (foo += v));

    expect(foo).toBe(value);

    opt.onNone(() => foo + 1);

    expect(foo).toBe(value);
  });

  it("None.onSome/onNone", () => {
    const opt = Option.Pure<number>();

    let foo = 0;

    opt.onSome(v => (foo += v));

    expect(foo).toBe(0);

    const value = 1;

    opt.onNone(() => (foo = value));

    expect(foo).toBe(value);
  });

  it("Some.mapSome", () => {
    const value = 1;
    const mult = 2;
    const opt = Option.Pure(0)
      .transform(x => x + value)
      .transform(x => x + value)
      .transform(x => x + value)
      .transform(x => x * mult)
      .transform(x => `${x}`);

    const expected = `${value * 3 * mult}`;

    expect(opt.isSome()).toBe(true);
    expect(opt.take()).toBe(expected);
  });

  it("None.mapSome", () => {
    const opt = Option.Pure<number>().transform(x => x * 2);

    expect(opt.isNone()).toBe(true);
  });

  it("Some.toResult", () => {
    const value = 0;
    const error = "error!";
    const res = Option.Pure<number>(value).toResult(error);

    expect(res.isOk()).toBe(true);
    expect(res.takeOk()).toBe(value);
  });

  it("None.toResult", () => {
    const error = "error!";
    const res = Option.Pure<number>().toResult(error);

    expect(res.isErr()).toBe(true);
    expect(res.takeErr()).toBe(error);
  });

  it("Some.check", () => {
    const value = 0;
    const opt1 = Option.Some(value).check(v => v === value);

    expect(opt1.isSome()).toBe(true);

    const opt2 = opt1.check(v => v > value + 1);

    expect(opt2.isNone()).toBe(true);
  });

  it("None.check", () => {
    const opt = Option.None().check(_ => true);

    expect(opt.isSome()).toBe(false);
  });

  it("Some.takeOr", () => {
    const value = 0;
    const result = Option.Some(value).takeOr(`${value}`);

    expect(result).toBe(value);
  });

  it("None.takeOr", () => {
    const value = 0;
    const result = Option.Pure().takeOr(value);

    expect(result).toBe(value);
  });

  it("FromNullable", () => {
    let value1: null | number | undefined;
    const opt1 = Option.FromNullable(value1);

    expect(opt1.isSome()).toBe(false);

    let value2: null | number = 10;
    const opt2: Option<number> = Option.FromNullable(value2);

    expect(opt2.isNone()).toBe(false);
    expect(opt2.take).not.throw;
    expect(opt2.take()).toBe(value2);
  });

  it("Example A", () => {
    const initial = 1;
    const alt = 64;
    const value1 = Option.Some(initial)
      .check(v => v === initial)
      .check(isNumber)
      .check(isPositive)
      .takeOr(alt);

    expect(value1).not.toBe(alt);
    expect(value1).toBe(initial);

    const value2 = Option.Some(initial)
      .check(v => v !== initial)
      .check(isNumber)
      .takeOr(alt);

    expect(value2).not.toBe(initial);
    expect(value2).toBe(alt);
  });
});
