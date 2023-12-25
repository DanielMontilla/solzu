import { describe, it } from "vitest";
import { None, Option, Some } from ".";
import { expect } from "vitest";
import { isNumber, isPositive } from "../number";

describe("Option", () => {
  it("Some.take", () => {
    const value = 0;
    const opt = Option.Some(value);
    expect(opt.take()).toBe(value);
  });

  it("None.take", () => {
    const opt = Option.None();
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
    const opt = Option.Of(value);
    expect(opt.isSome()).toBe(true);
    expect(opt.isNone()).toBe(false);
  });

  it("None.isSome/isNone", () => {
    const opt = Option.Of();
    expect(opt.isSome()).toBe(false);
    expect(opt.isNone()).toBe(true);
  });

  it("Some.onSome/onNone", () => {
    const value = 5;
    const opt = Option.Of(value);

    let foo = 0;

    opt.onSome(v => (foo += v));

    expect(foo).toBe(value);

    opt.onNone(() => foo + 1);

    expect(foo).toBe(value);
  });

  it("None.onSome/onNone", () => {
    const opt = Option.Of<number>();

    let foo = 0;

    opt.onSome(v => (foo += v));

    expect(foo).toBe(0);

    const value = 1;

    opt.onNone(() => (foo = value));

    expect(foo).toBe(value);
  });

  describe("Option tests", () => {
    it("Some.mapSome", () => {
      const value = 1;
      const double = (x: number) => x * 2;
      const opt = Option.Of<number>(value).mapSome(double);
      expect(opt.take()).toBe(2);
    });

    it("None.mapSome", () => {
      const double = (x: number) => x * 2;
      const opt = Option.Of<number>().mapSome(double);
      expect(opt.isNone()).toBe(true);
    });

    it("Some.mapNone", () => {
      const value = 1;
      const opt = Option.Of<number>(value).mapNone(() => 10);
      expect(opt.isSome()).toBe(false);
    });

    it("None.mapNone", () => {
      const newValue = 10;
      const opt = Option.None().mapNone(() => newValue);
      expect(opt.isSome()).toBe(true);
      expect(opt.take()).toBe(newValue);
    });
  });

  it("Some.toResult", () => {
    const value = 0;
    const error = "error!";
    const res = Option.Of<number>(value).toResult(error);

    expect(res.isOk()).toBe(true);
    expect(res.takeOk()).toBe(value);
  });

  it("None.toResult", () => {
    const error = "error!";
    const res = Option.Of<number>().toResult(error);

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
    const result = Option.Of().takeOr(value);

    expect(result).toBe(value);
  });

  describe("Flatten", () => {
    it("flattens nested Some instances", () => {
      const nestedSome = Option.Some(Option.Some(10));
      const flattened = nestedSome.flatten();
      expect(flattened).toBeInstanceOf(Some);
      expect(flattened.take()).toBe(10);
    });

    it("flattens deeply nested Some instances", () => {
      const deeplyNestedSome = Option.Some(Option.Some(Option.Some(10)));
      const flattened = deeplyNestedSome.flatten();
      expect(flattened).toBeInstanceOf(Some);
      expect(flattened.take()).toBe(10);
    });

    it("returns None when flattening a None", () => {
      const none = Option.None();
      const flattened = none.flatten();
      expect(flattened).toBeInstanceOf(None);
    });

    it("returns None when flattening a nested None", () => {
      const nestedNone = Option.Some(Option.None());
      const flattened = nestedNone.flatten();
      expect(flattened).toBeInstanceOf(None);
    });
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

  it("Example B", () => {
    type Person = { name: string; age?: number; awards?: string[] };

    const tryGetPersonDescription = (person: Person) =>
      Option.Of(person.age)
        .mapSome(age => `Is ${age} years old!`)
        .mapNone(() =>
          Option.Of(person.awards).mapSome(
            awards => `Has won these awards: ${awards}`
          )
        )
        .flatten();

    const person1: Person = { name: "Daniel" };
  });
});
