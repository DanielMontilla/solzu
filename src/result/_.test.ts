import { describe, it, expect } from "vitest";
import { Result, Err, Ok } from ".";
import { delay } from "..";

describe("Result", () => {
  it("Ok", () => {
    const ok1 = Result.Ok();
    expect(ok1.takeErr).toThrowError();
    expect(ok1.takeOk()).toBe(undefined);

    const value = 0;
    const ok2 = Result.Ok(value);
    expect(ok2.value).toBe(value);
  });

  describe("Factory Methods", () => {
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
