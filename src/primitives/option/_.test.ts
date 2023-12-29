import { describe, it, expect } from "vitest";
import { None, Option, Some } from "../..";

describe("Option Class", () => {
  describe("Some", () => {
    it("should retrieve the wrapped value when take() is called", () => {
      const value = 0;
      const opt = Option.Some(value);
      expect(opt.take()).toBe(value);
    });

    it("should return true when isSome() is called", () => {
      const value = 0;
      const opt = Option.Some(value);
      expect(opt.isSome()).toBe(true);
    });

    it("should return false when isNone() is called", () => {
      const value = 0;
      const opt = Option.Some(value);
      expect(opt.isNone()).toBe(false);
    });

    it("should execute a function with the stored value when onSome() is called", () => {
      const value = 5;
      const opt = Option.Some(value);

      let foo = 0;
      opt.onSome(v => (foo += v));
      expect(foo).toBe(value);
    });

    it("should not execute a function when onNone() is called", () => {
      const value = 5;
      const opt = Option.Some(value);

      let foo = 0;
      opt.onNone(() => (foo += 1));
      expect(foo).toBe(0);
    });

    it("should apply a function to the stored value when mapSome() is called", () => {
      const value = 1;
      const double = (x: number) => x * 2;
      const opt = Option.Some(value).mapSome(double);
      expect(opt.take()).toBe(2);
    });

    it("should not affect the instance when mapNone() is called", () => {
      const value = 1;
      const opt = Option.Some(value).mapNone(() => 10);
      expect(opt.isSome()).toBe(false);
    });

    it("should convert to a Result with Ok value when toResult() is called", () => {
      const value = 0;
      const error = "error!";
      const res = Option.Some(value).toResult(error);

      expect(res.isOk()).toBe(true);
    });

    it("should remain as Some or convert to None based on a predicate when check() is called", () => {
      const value = 0;
      const opt1 = Option.Some(value).check(v => v === value);

      expect(opt1.isSome()).toBe(true);

      const opt2 = opt1.check(v => v > value + 1);

      expect(opt2.isNone()).toBe(true);
    });

    it("should return the stored value or a default when takeOr() is called", () => {
      const value = 0;
      const result = Option.Some(value).takeOr(`${value}`);

      expect(result).toBe(value);
    });
  });

  describe("None", () => {
    it("should throw an error when take() is called", () => {
      const opt = Option.None();
      expect(opt.take).toThrowError();
    });

    it("should throw the provided error when takeWith() is called", () => {
      const error1 = "my error";
      const value1 = Option.None();
      expect(value1.takeWith).toThrow;
      expect(() => value1.takeWith(error1)).toThrow(error1);

      const error2 = Error("my other error");
      const value2 = Option.None();
      expect(value2.takeWith).toThrow;
      expect(() => value2.takeWith(error2)).toThrow(error2);
    });

    it("should return false when isSome() is called", () => {
      const opt = Option.None();
      expect(opt.isSome()).toBe(false);
    });

    it("should return true when isNone() is called", () => {
      const opt = Option.None();
      expect(opt.isNone()).toBe(true);
    });

    it("should not execute a function when onSome() is called", () => {
      const opt = Option.None();

      let foo = 0;
      opt.onSome(v => (foo += v));
      expect(foo).toBe(0);
    });

    it("should execute a function when onNone() is called", () => {
      const opt = Option.None();

      let foo = 0;
      const value = 1;
      opt.onNone(() => (foo = value));
      expect(foo).toBe(value);
    });

    it("should remain None when mapSome() is called", () => {
      const double = (x: number) => x * 2;
      const opt = Option.None().mapSome(double);
      expect(opt.isNone()).toBe(true);
    });

    it("should transform into Some when mapNone() is called", () => {
      const newValue = 10;
      const opt = Option.None().mapNone(() => newValue);
      expect(opt.isSome()).toBe(true);
      expect(opt.take()).toBe(newValue);
    });

    it("should convert to a Result with Err when toResult() is called", () => {
      const error = "error!";
      const res = Option.None().toResult(error);

      expect(res.isErr()).toBe(true);
      expect(res.takeErr()).toBe(error);
    });

    it("should remain None regardless of the predicate when check() is called", () => {
      const opt = Option.None().check(_ => true);

      expect(opt.isSome()).toBe(false);
    });

    it("should return a default value when takeOr() is called", () => {
      const value = 0;
      const result = Option.None().takeOr(value);

      expect(result).toBe(value);
    });
  });

  describe("flatten", () => {
    it("flattens nested Some instances", () => {
      const nestedSome = Option.Some(Option.Some(10));
      const flattened = nestedSome.flatten();
      expect(flattened).toBeInstanceOf(Some);
      expect(flattened.take()).toBe(10);
    });

    it("should return same Some instance on non-nested Some", () => {
      const some = Option.Some(10);
      const flattened = some.flatten();
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

  describe("Factory Methods", () => {
    it("should create None for null or undefined values when FromNullable() is called", () => {
      let value1: null | number | undefined;
      const opt1 = Option.FromNullable(value1);

      expect(opt1.isSome()).toBe(false);

      let value2: null | number = 10;
      const opt2: Option<number> = Option.FromNullable(value2);

      expect(opt2.isNone()).toBe(false);
      expect(() => opt2.take()).not.toThrowError();
      expect(opt2.take()).toBe(value2);
    });
  });
});
