import { describe, it, expect, vi } from "vitest";
import {
  ok,
  okInner,
  errResult,
  okResult,
  err,
  errInner,
  CustomError,
} from "./@common.test";
import { EMPTY, Err, Ok, Result } from "../..";

describe(".take", () => {
  describe("Result", () => {
    it("should return the inner value when called on an `Ok` instance", () => {
      expect(okResult.take()).toBe(okInner);
    });
    it("should error when called on an err instance", () => {
      expect(() => errResult.take()).toThrow(Result.ERROR.take);
    });
  });

  describe("Ok", () => {
    it("should return the inner value", () => {
      expect(ok.take()).toBe(okInner);
    });
  });

  describe("Err", () => {
    it("should error", () => {
      expect(() => err.take()).toThrow(Result.ERROR.take);
    });
  });
});

describe(".takeErr", () => {
  describe("Result", () => {
    it("should return the error value when called on an `Err` instance", () => {
      expect(errResult.takeErr()).toBe(errInner);
    });
    it("should error when called on an `Ok` instance", () => {
      expect(() => okResult.takeErr()).toThrow(Result.ERROR.takeErr);
    });
  });

  describe("Ok", () => {
    it("should error", () => {
      expect(() => ok.takeErr()).toThrow(Result.ERROR.takeErr);
    });
  });

  describe("Err", () => {
    it("should return the error value", () => {
      expect(err.takeErr()).toBe(errInner);
    });
  });
});

describe(".isOk", () => {
  describe("Result", () => {
    it("should return true on Ok instance", () => {
      expect(okResult.isOk()).toBe(true);
    });

    it("should return false on Err instance", () => {
      expect(errResult.isOk()).toBe(false);
    });
  });

  describe("Ok", () => {
    it("should return true", () => {
      expect(ok.isOk()).toBe(true);
    });
  });

  describe("Err", () => {
    it("should return false", () => {
      expect(err.isOk()).toBe(false);
    });
  });
});

describe(".isErr", () => {
  describe("Result", () => {
    it("should return false on Ok instance", () => {
      expect(okResult.isErr()).toBe(false);
    });
    it("should return true on Err instance", () => {
      expect(errResult.isErr()).toBe(true);
    });
  });

  describe("Ok", () => {
    it("should return false", () => {
      expect(ok.isErr()).toBe(false);
    });
  });

  describe("Err", () => {
    it("should return true", () => {
      expect(err.isErr()).toBe(true);
    });
  });
});

describe(".onOk", () => {
  describe("Result", () => {
    it("should ALWAYS call function when called on Ok instane", () => {
      const effect = vi.fn();
      okResult.onOk(effect);
      expect(effect).toBeCalled();
      expect(effect).toBeCalledWith(okInner);
    });

    it("should NEVER call function when called on Err instane", () => {
      const effect = vi.fn();
      errResult.onOk(effect);
      expect(effect).not.toBeCalled();
    });
  });

  describe("Ok", () => {
    it("should call function", () => {
      const effect = vi.fn();
      okResult.onOk(effect);
      expect(effect).toBeCalled();
    });
    it("should call function w/ inner value as arg", () => {
      const effect = vi.fn();
      okResult.onOk(effect);
      expect(effect).toBeCalledWith(okInner);
    });
  });

  describe("Err", () => {
    it("should not call function", () => {
      const effect = vi.fn();
      errResult.onOk(effect);
      expect(effect).not.toBeCalled();
    });
  });
});

describe(".onErr", () => {
  describe("Result", () => {
    it("should ALWAYS call function when called on Err instance", () => {
      const effect = vi.fn();
      errResult.onErr(effect);
      expect(effect).toBeCalled();
      expect(effect).toBeCalledWith(errInner);
    });

    it("should NEVER call function when called on Ok instance", () => {
      const effect = vi.fn();
      okResult.onErr(effect);
      expect(effect).not.toBeCalled();
    });
  });

  describe("Ok", () => {
    it("should not call function", () => {
      const effect = vi.fn();
      okResult.onErr(effect);
      expect(effect).not.toBeCalled();
    });
  });

  describe("Err", () => {
    it("should call function", () => {
      const effect = vi.fn();
      errResult.onErr(effect);
      expect(effect).toBeCalled();
    });

    it("should call function w/ inner error value as arg", () => {
      const effect = vi.fn();
      errResult.onErr(effect);
      expect(effect).toBeCalledWith(errInner);
    });
  });
});

describe(".map", () => {
  const mapper = (value: number) => value * 2;

  describe("Result", () => {
    it("should transform the value when called on Ok instance", () => {
      const okMapper = vi.fn(mapper);
      const mappedResult = okResult.map(okMapper);
      expect(okMapper).toBeCalled();
      expect(okMapper).toBeCalledWith(okInner);
      expect(mappedResult).toBeInstanceOf(Ok);
      expect(mappedResult.take()).toBe(okInner * 2);
    });

    it("should not transform the value when called on Err instance", () => {
      const okMapper = vi.fn(mapper);
      const mappedResult = errResult.map(okMapper);
      expect(okMapper).not.toBeCalled();
      expect(mappedResult).toBeInstanceOf(Err);
      expect(mappedResult.takeErr()).toBe(errInner);
    });
  });

  describe("Ok", () => {
    it("should transform the inner value", () => {
      const okMapper = vi.fn(mapper);
      const mappedResult = ok.map(okMapper);
      expect(okMapper).toBeCalledWith(okInner);
      expect(mappedResult.value).toBe(okInner * 2);
    });
  });

  describe("Err", () => {
    it("should not transform the inner value", () => {
      const okMapper = vi.fn(mapper);
      const mappedResult = err.map(okMapper);
      expect(okMapper).not.toBeCalled();
      expect(mappedResult.error).toBe(errInner);
    });
  });
});

describe(".chain", () => {
  const chainFnFn = (type: "ok" | "err") =>
    type === "ok"
      ? vi.fn(value => Result.Ok(value * 2))
      : vi.fn(_ => Result.Err<CustomError>("A"));

  describe("Result", () => {
    it("should transform value if the original result is of type Ok and the chain result is also Ok", () => {
      const chainFn = chainFnFn("ok");
      const chainedResult = okResult.chain(chainFn);
      expect(chainFn).toBeCalledWith(okInner);
      expect(chainedResult).toBeInstanceOf(Ok);
      expect(chainedResult.take()).toBe(okInner * 2);
    });

    it("should become Err if the original result is of type Ok and the chain result is Err", () => {
      const chainFn = chainFnFn("err");
      const chainedResult = okResult.chain(chainFn);
      expect(chainFn).toBeCalledWith(okInner);
      expect(chainedResult).toBeInstanceOf(Err);
      expect(chainedResult.takeErr()).toBe("A");
    });

    it("should remain Err if the original result is of type Err, regardless if the chain result is Ok or Err", () => {
      const okChainFn = chainFnFn("ok");
      const errChainFn = chainFnFn("err");
      const okChainedResult = errResult.chain(okChainFn);
      const errChainedResult = errResult.chain(errChainFn);

      expect(okChainFn).not.toBeCalled();
      expect(errChainFn).not.toBeCalled();
      expect(okChainedResult).toBeInstanceOf(Err);
      expect(errChainedResult).toBeInstanceOf(Err);
      expect(okChainedResult.takeErr()).toBe(errInner);
      expect(errChainedResult.takeErr()).toBe(errInner);
    });
  });
});

describe(".refine", () => {
  const mapper = (e: string) => e + " refined";

  describe("Result", () => {
    it("should transform the error when called on Err instance", () => {
      const errorMapper = vi.fn(mapper);
      const refinedResult = errResult.refine(errorMapper);
      expect(errorMapper).toBeCalled();
      expect(errorMapper).toBeCalledWith(errInner);
      expect(refinedResult).toBeInstanceOf(Err);
      expect(refinedResult.takeErr()).toBe(errInner + " refined");
    });

    it("should not transform the error when called on Ok instance", () => {
      const errorMapper = vi.fn(mapper);
      const refinedResult = okResult.refine(errorMapper);
      expect(errorMapper).not.toBeCalled();
      expect(refinedResult).toBeInstanceOf(Ok);
      expect(refinedResult.take()).toBe(okInner);
    });
  });

  describe("Ok", () => {
    it("should not transform the error", () => {
      const errorMapper = vi.fn(mapper);
      const refinedResult = ok.refine(errorMapper);
      expect(errorMapper).not.toBeCalled();
      expect(refinedResult.value).toBe(okInner);
    });
  });

  describe("Err", () => {
    it("should transform the error", () => {
      const errorMapper = vi.fn(mapper);
      const refinedResult = err.refine(errorMapper);
      expect(errorMapper).toBeCalledWith(errInner);
      expect(refinedResult.error).toBe(errInner + " refined");
    });
  });
});

describe(".check", () => {
  describe("@overload when called with only prediacate argument", () => {
    describe("Result", () => {
      console.log("check03");
      it("should return Ok on Ok instance with positive predicate", () => {
        const checkedResult = okResult.check(_ => true);
        expect(checkedResult).toBeInstanceOf(Ok);
        expect(checkedResult.take()).toBe(okInner);
      });
      it("should return Err on Ok instance with negative predicate", () => {
        const checkedResult = okResult.check(_ => false);
        expect(checkedResult).toBeInstanceOf(Err);
        expect(checkedResult.takeErr()).toBe(EMPTY);
      });
      it("should always return Err on Err instance regardless of predicate return", () => {
        const checkedResultPositive = errResult.check(_ => true);
        const checkedResultNegative = errResult.check(_ => false);
        expect(checkedResultPositive).toBeInstanceOf(Err);
        expect(checkedResultPositive.takeErr()).toBe(errInner);
        expect(checkedResultNegative).toBeInstanceOf(Err);
        expect(checkedResultNegative.takeErr()).toBe(errInner);
      });
    });

    describe("Ok", () => {
      it("should remain Ok on positive predicate", () => {
        const checkedResult = ok.check(_ => true);
        expect(checkedResult).toBeInstanceOf(Ok);
        expect(checkedResult.take()).toBe(okInner);
      });
      it("should become Err on negative predicate & have empty error", () => {
        const checkedResult = ok.check(_ => false);
        expect(checkedResult).toBeInstanceOf(Err);
        expect(checkedResult.takeErr()).toBe(EMPTY);
      });
    });

    describe("Err", () => {
      it("should always return origin Err", () => {
        const checkedResult = err.check(_ => true);
        expect(checkedResult).toBeInstanceOf(Err);
        expect(checkedResult.takeErr()).toBe(errInner);
      });
      it("should never call predicate", () => {
        const predicateFn = vi.fn(_ => true);
        expect(predicateFn).not.toBeCalled();
      });
    });
  });
});

describe(".Ok", () => {
  describe("@overload when called with value", () => {
    it("should return an Ok result containing the value", () => {
      const value = "describe";
      const result = Result.Ok(value);
      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toBe(value);
    });
  });

  describe("@overload when called without a value", () => {
    it("should return an Ok result containing an empty value", () => {
      const result = Result.Ok();
      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toBe(EMPTY);
    });
  });
});

describe(".Err", () => {
  describe("@overload when called with value", () => {
    it("should return an Err result containing the error", () => {
      const error = "error message";
      const result = Result.Err(error);
      expect(result).toBeInstanceOf(Err);
      expect(result.error).toBe(error);
    });
  });

  describe("@overload when called without a value", () => {
    it("should return an Err result containing an empty value", () => {
      const result = Result.Err();
      expect(result).toBeInstanceOf(Err);
      expect(result.error).toBe(EMPTY);
    });
  });
});

describe.concurrent(".FromPromise", () => {
  describe("@overload when called with just a promise or promise-returning function", () => {
    it("should return Ok with the resolved value for a resolving promise", async ({
      expect,
    }) => {
      const promise = Promise.resolve("Success");
      const result = await Result.FromPromise(promise);
      expect(result).toBeInstanceOf(Ok);
      expect(result.take()).toBe("Success");
    });

    it("should return Err with the error for a rejecting promise", async ({
      expect,
    }) => {
      const promise = Promise.reject(new Error("Failure"));
      const result = await Result.FromPromise(promise);
      expect(result).toBeInstanceOf(Err);
    });

    it("should return Ok with the resolved value for a resolving promise-returning function", async ({
      expect,
    }) => {
      const promiseFunc = () => Promise.resolve("Success from function");
      const result = await Result.FromPromise(promiseFunc);
      expect(result).toBeInstanceOf(Ok);
      expect(result.take()).toBe("Success from function");
    });

    it("should return Err with the error for a rejecting promise-returning function", async ({
      expect,
    }) => {
      const promiseFunc = () =>
        Promise.reject(new Error("Failure from function"));
      const result = await Result.FromPromise(promiseFunc);
      expect(result).toBeInstanceOf(Err);
    });
  });

  describe("@overload when called with a promise or function-returning promise and an error mapper", () => {
    it("should return Ok with the resolved value for a resolving promise", async ({
      expect,
    }) => {
      const promise = Promise.resolve("Success");
      const result = await Result.FromPromise(promise, e => `Mapped: ${e}`);
      expect(result).toBeInstanceOf(Ok);
      expect(result.take()).toBe("Success");
    });

    it("should return Err with the mapped error for a rejecting promise", async ({
      expect,
    }) => {
      const error = new Error("Failure");
      const errorMapper = (e: unknown) => `Mapped: ${e}`;
      const promise = Promise.reject(error);
      const result = await Result.FromPromise(promise, errorMapper);
      expect(result).toBeInstanceOf(Err);
      expect(result.takeErr()).toBe(`Mapped: ${error}`);
    });

    it("should return Ok with the resolved value for a resolving promise-returning function", async ({
      expect,
    }) => {
      const promiseFunc = () => Promise.resolve("Success from function");
      const result = await Result.FromPromise(promiseFunc, e => `Mapped: ${e}`);
      expect(result).toBeInstanceOf(Ok);
      expect(result.take()).toBe("Success from function");
    });

    it("should return Err with the mapped error for a rejecting promise-returning function", async ({
      expect,
    }) => {
      const error = new Error("Failure from function");
      const promiseFunc = () => Promise.reject(error);
      const errorMapper = (e: unknown) => `Mapped: ${e}`;
      const result = await Result.FromPromise(promiseFunc, errorMapper);
      expect(result).toBeInstanceOf(Err);
      expect(result.takeErr()).toBe(`Mapped: ${error}`);
    });
  });
});

describe(".FromTryCatch", () => {
  describe("@overload when called with just a function", () => {
    it("should return Ok with the function's return value", () => {
      const fn = () => "Success";
      const result = Result.FromTryCatch(fn);
      expect(result.isOk()).toBe(true);
      expect(result.take()).toBe("Success");
    });

    it("should return Err with the error if the function throws", () => {
      const fn = () => {
        throw new Error("Failure");
      };
      const result = Result.FromTryCatch(fn);
      expect(result.isErr()).toBe(true);
    });
  });

  describe("@overload when called with a function and an error mapper", () => {
    it("should return Ok with the function's return value", () => {
      const fn = () => "Success";
      const result = Result.FromTryCatch(fn, e => `Mapped: ${e}`);
      expect(result.isOk()).toBe(true);
      expect(result.take()).toBe("Success");
    });

    it("should return Err with the mapped error if the function throws", () => {
      const error = new Error("Failure");
      const fn = () => {
        throw error;
      };
      const errorMapper = (e: unknown) => `Mapped: ${e}`;
      const result = Result.FromTryCatch(fn, errorMapper);
      expect(result.isErr()).toBe(true);
      expect(result.takeErr()).toBe(`Mapped: ${error}`);
    });
  });
});
