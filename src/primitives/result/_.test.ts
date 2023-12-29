import { describe, it, expect, vi, expectTypeOf } from "vitest";
import { None, Some, delay, Result, Err, Ok, Guard } from "../..";

describe("Result", () => {
  describe("Ok", () => {
    it("should create an Ok result with a value", () => {
      const value = "Success";
      const okResult = Result.Ok(value);
      expect(okResult).toBeInstanceOf(Ok);
      expect(okResult.value).toBe(value);
    });

    it("should create an Ok result without a value", () => {
      const okResult = Result.Ok();
      expect(okResult).toBeInstanceOf(Ok);
      expect(okResult.value).toBeUndefined();
    });
  });

  describe("Err", () => {
    it("should create an Err result with an error", () => {
      const error = new Error("Failure");
      const errResult = Result.Err(error);
      expect(errResult).toBeInstanceOf(Err);
      expect(errResult.error).toBe(error);
    });

    it("should create an Err result without an error", () => {
      const errResult = Result.Err();
      expect(errResult).toBeInstanceOf(Err);
      expect(errResult.error).toBeUndefined();
    });
  });

  describe("takeOk", () => {
    it("should return the Ok value", () => {
      const ok = Result.Ok("Success");
      expect(ok.takeOk()).toBe("Success");
    });

    it("should throw if the Result is Err", () => {
      const err = Result.Err("Error");
      expect(() => err.takeOk()).toThrow();
    });
  });

  describe("takeErr", () => {
    it("should return the Err value", () => {
      const err = Result.Err("Error");
      expect(err.takeErr()).toBe("Error");
    });

    it("should throw if the Result is Ok", () => {
      const ok = Result.Ok("Success");
      expect(() => ok.takeErr()).toThrow();
    });
  });

  describe("isOk", () => {
    it("should return true if the Result is Ok", () => {
      const ok = Result.Ok("Success");
      expect(ok.isOk()).toBe(true);
    });

    it("should return false if the Result is Err", () => {
      const err = Result.Err("Error");
      expect(err.isOk()).toBe(false);
    });
  });

  describe("isErr", () => {
    it("should return true if the Result is Err", () => {
      const err = Result.Err("Error");
      expect(err.isErr()).toBe(true);
    });

    it("should return false if the Result is Ok", () => {
      const ok = Result.Ok("Success");
      expect(ok.isErr()).toBe(false);
    });
  });

  describe("onOk", () => {
    it("should execute the function if the Result is Ok", () => {
      const ok = Result.Ok("Success");
      const mockFn = vi.fn();
      ok.onOk(mockFn);
      expect(mockFn).toHaveBeenCalledWith("Success");
    });
  });

  describe("onErr", () => {
    it("should execute the function if the Result is Err", () => {
      const err = Result.Err("Error");
      const mockFn = vi.fn();
      err.onErr(mockFn);
      expect(mockFn).toHaveBeenCalledWith("Error");
    });
  });

  describe("checkOk", () => {
    it("should return the same Ok if the predicate returns true", () => {
      const ok = Result.Of("ok", 10);
      const checked = ok.checkOk(x => x > 5);
      expect(checked).toBeInstanceOf(Ok);
      expect(checked.takeOk()).toBe(10);
    });

    it("should return the same Ok if the predicate returns true", () => {
      const ok = Result.Of("ok", 10);
      const checked = ok.checkOk(x => x > 5);
      expect(checked).toBeInstanceOf(Ok);
      expect(checked.takeOk()).toBe(10);
    });

    it("should return Err with the new error if the predicate returns false", () => {
      const ok = Result.Of("ok", 3);
      const checked = ok.checkOk(x => x > 5, "Value is too low");
      expect(checked).toBeInstanceOf(Err);
      expect(checked.takeErr()).toBe("Value is too low");
    });

    it("should return the same Err if the original Result is Err", () => {
      const err = Result.Of<number, string>("err", "Original Error");
      const checked = err.checkOk(x => x > 5, "New Error");
      expect(checked).toBeInstanceOf(Err);
      expect(checked.takeErr()).toBe("Original Error");
    });

    it("should return Err with the original error if no new error is provided and predicate returns false", () => {
      const ok = Result.Of("ok", 3);
      const err = Result.Of<number, string>("err", "Original Error");
      const checkedOk = ok.checkOk(x => x > 5);
      const checkedErr = err.checkOk(x => x > 5);
      expect(checkedOk).toBeInstanceOf(Err);
      expect(checkedErr).toBeInstanceOf(Err);
      expect(checkedErr.takeErr()).toBe("Original Error");
    });

    it("should return Result<V, E | Extra> from a Result<V, E>", () => {
      type OriginalErrors = "Error 1" | "Error 2";
      type AdditionalErrors = "Error 3" | "Error 4";
      const result = Result.Of<number, OriginalErrors>(
        "ok",
        10
      ).checkOk<AdditionalErrors>(_ => true, "Error 3");

      expectTypeOf(result).toMatchTypeOf<
        Result<number, OriginalErrors | AdditionalErrors>
      >();
      expectTypeOf(result).not.toMatchTypeOf<Result<number, OriginalErrors>>();
    });
  });

  describe("assertOk", () => {
    const isString: Guard<string> = (value): value is string =>
      typeof value === "string";

    it("passes through Err results", () => {
      const result = Result.Err("Initial Error");
      const asserted = result.assertOk(isString, "Not a string");
      expect(asserted.isErr()).toBe(true);
      expect(asserted.takeErr()).toBe("Initial Error");
    });

    it("asserts Ok values correctly and passes them through if they match the guard", () => {
      const result = Result.Ok("I am a string");
      const asserted = result.assertOk(isString);
      expect(asserted.isOk()).toBe(true);
      expect(asserted.takeOk()).toBe("I am a string");
    });

    it("converts Ok values to Err if they do not match the guard", () => {
      const result = Result.Ok(123);
      const asserted = result.assertOk(isString, "Not a string");
      expect(asserted.isErr()).toBe(true);
      expect(asserted.takeErr()).toBe("Not a string");
    });

    it("should properly infer error type unions", () => {
      enum ErrorA {
        Error1,
        Error2,
      }
      enum ErrorB {
        Error3,
        Error4,
      }

      const guard: Guard<number> = (_): _ is number => true;

      const result = Result.Of("err", ErrorA.Error1).assertOk(
        guard,
        ErrorB.Error4
      );

      expectTypeOf(result).toMatchTypeOf<Result<number, ErrorA | ErrorB>>();
    });
  });

  describe("mapOk", () => {
    it("should apply the mapper to Ok value and return a new Ok", () => {
      const ok = Result.Of("ok", 5);
      const mapped = ok.mapOk(x => x * 2);
      expect(mapped.isOk()).toBe(true);
      expect(mapped.takeOk()).toBe(10);
    });

    it("should return the same Err if the result is Err", () => {
      const err = Result.Of<number, string>("err", "Error");
      const mapped = err.mapOk(x => x * 2);
      expect(mapped.isErr()).toBe(true);
      expect(mapped.takeErr()).toBe("Error");
    });
  });

  describe("mapErr", () => {
    it("should apply the mapper to Err value and return a new Err", () => {
      const err = Result.Of("err", "Error");
      const mapped = err.mapErr(err => `Mapped: ${err}`);
      expect(mapped.isErr()).toBe(true);
      expect(mapped.takeErr()).toBe("Mapped: Error");
    });

    it("should return the same Ok if the result is Ok", () => {
      const ok = Result.Of("ok", 5);
      const mapped = ok.mapErr(err => `Mapped: ${err}`);
      expect(mapped.isOk()).toBe(true);
      expect(mapped.takeOk()).toBe(5);
    });
  });

  describe("toEither", () => {
    it("should convert Ok to Left", () => {
      const ok = Result.Ok("Success");
      const either = ok.toEither();
      expect(either.isLeft()).toBe(true);
    });

    it("should convert Err to Right", () => {
      const err = Result.Err("Error");
      const either = err.toEither();
      expect(either.isRight()).toBe(true);
    });
  });

  describe("toOption", () => {
    it("should convert Ok to Some", () => {
      const okResult = Result.Ok("Success");
      const option = okResult.toOption();
      expect(option).toBeInstanceOf(Some);
      expect(option.value).toBe("Success");
    });

    it("should convert Err to None", () => {
      const errResult = Result.Err("Failure");
      const option = errResult.toOption();
      expect(option).toBeInstanceOf(None);
    });
  });

  describe("Factory Methods", () => {
    describe("Of", () => {
      it("should create an Ok result with no content when no parameters are provided", () => {
        const result = Result.Of();
        expect(result.isOk()).toBe(true);
        expect(result.takeOk()).toBeUndefined();
      });

      it("should create an Ok result with content", () => {
        const result = Result.Of("ok", "Success!");
        expect(result.isOk()).toBe(true);
        expect(result.takeOk()).toBe("Success!");
      });

      it("should create an Err result with content", () => {
        const result = Result.Of("err", "Error occurred");
        expect(result.isErr()).toBe(true);
        expect(result.takeErr()).toBe("Error occurred");
      });

      it("should create an Ok result when kind is 'ok' and content is undefined", () => {
        const result = Result.Of("ok");
        expect(result.isOk()).toBe(true);
        expect(result.takeOk()).toBeUndefined();
      });

      it("should create an Err result when kind is 'err' and content is undefined", () => {
        const result = Result.Of("err");
        expect(result.isErr()).toBe(true);
        expect(result.takeErr()).toBeUndefined();
      });

      it("should create a Result<void, void> when called with no content argument", () => {
        expectTypeOf(Result.Of()).toMatchTypeOf<Result<void, void>>();
        expectTypeOf(Result.Of("ok")).toMatchTypeOf<Result<void, void>>();
        expectTypeOf(Result.Of("err")).toMatchTypeOf<Result<void, void>>();
      });

      it("should create a Result<V, void> when `ok` kind is provided with value", () => {
        expectTypeOf(Result.Of("ok", 10)).toMatchTypeOf<Result<number, void>>();
      });

      it("should create a Result<void, E> when `err` kind is provided with value", () => {
        const customError = "CustomError" as const;
        expectTypeOf(Result.Of("err", customError)).toMatchTypeOf<
          Result<void, typeof customError>
        >();
      });

      it("should match passed in generic arguments regardless of kind", () => {
        expectTypeOf(Result.Of<number, string>("ok", 10)).toMatchTypeOf<
          Result<number, string>
        >();
        expectTypeOf(Result.Of<boolean, string>("err", "error")).toMatchTypeOf<
          Result<boolean, string>
        >();
      });
    });
    describe.concurrent("FromPromise", () => {
      it("should return Ok with the resolved value for a resolving promise", async ({
        expect,
      }) => {
        const promise = delay(100, { mode: "resolve", value: "Success" });
        const result = await Result.FromPromise(promise);
        expect(result).toBeInstanceOf(Ok);
        expect(result.takeOk()).toBe("Success");
      });

      it("should return Err with the error for a rejecting promise", async ({
        expect,
      }) => {
        const promise = delay(100, { mode: "reject" });
        const result = await Result.FromPromise(promise);
        expect(result).toBeInstanceOf(Err);
      });

      it("should return Err with the mapped error for a rejecting promise", async ({
        expect,
      }) => {
        const error = `Promise Failed` as const;
        const errorMapper = (_: unknown) => error;
        const promise = delay(100, { mode: "reject" });
        const result = await Result.FromPromise(promise, errorMapper);
        expect(result).toBeInstanceOf(Err);
        expect(result.takeErr()).toBe(error);
      });
    });
    describe("FromTryCatch", () => {
      it("should return Ok with the function's return value for successful execution", () => {
        const successfulFn = () => "Success";
        const result = Result.FromTryCatch(successfulFn);
        expect(result).toBeInstanceOf(Ok);
        expect(result.takeOk()).toBe("Success");
      });

      it("should return Err with the error for a function that throws", () => {
        const throwingFn = () => {
          throw new Error("Failure");
        };
        const result = Result.FromTryCatch(throwingFn);
        expect(result).toBeInstanceOf(Err);
        expect(result.takeErr()).toBeInstanceOf(Error);
      });

      it("should return Err with the mapped error for a function that throws", () => {
        const throwingFn = () => {
          throw new Error("Failure");
        };
        const errorMapper = (error: unknown) =>
          `Mapped: ${error instanceof Error ? error.message : "Unknown error"}`;
        const result = Result.FromTryCatch(throwingFn, errorMapper);
        expect(result).toBeInstanceOf(Err);
        expect(result.takeErr()).toBe("Mapped: Failure");
      });

      it("should return Err with a different type of error when using a mapper", () => {
        const throwingFn = () => {
          throw new Error("Failure");
        };
        const errorMapper = (error: unknown) => ({
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        });
        const result = Result.FromTryCatch(throwingFn, errorMapper);
        expect(result).toBeInstanceOf(Err);
        expect(result.takeErr()).toEqual({ errorMessage: "Failure" });
      });
    });
  });
});
