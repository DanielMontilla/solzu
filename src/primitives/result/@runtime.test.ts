import { describe, test, it, expect, vi } from "vitest";
import {
  ok,
  okInner,
  errResult,
  okResult,
  err,
  errInner,
  CustomerErrorEnum,
  CustomError,
} from "./@common.test";
import { Err, Ok, Result } from "../..";

describe(".take", () => {
  test("Result", () => {
    it("should return the inner value when called on an `Ok` instance", () => {
      expect(okResult.take()).toBe(okInner);
    });
    it("should error when called on an err instance", () => {
      expect(() => errResult.take()).toThrow(Result.ERROR.take);
    });
  });

  test("Ok", () => {
    it("should return the inner value", () => {
      expect(ok.take()).toBe(okInner);
    });
  });

  test("Err", () => {
    it("should error", () => {
      expect(() => err.take()).toThrow(Result.ERROR.take);
    });
  });
});

describe(".takeErr", () => {
  test("Result", () => {
    it("should return the error value when called on an `Err` instance", () => {
      expect(errResult.takeErr()).toBe(errInner);
    });
    it("should error when called on an `Ok` instance", () => {
      expect(() => okResult.takeErr()).toThrow(Result.ERROR.takeErr);
    });
  });

  test("Ok", () => {
    it("should error", () => {
      expect(() => ok.takeErr()).toThrow(Result.ERROR.takeErr);
    });
  });

  test("Err", () => {
    it("should return the error value", () => {
      expect(err.takeErr()).toBe(errInner);
    });
  });
});

describe(".isOk", () => {
  test("Result", () => {
    it("should return true on Ok instance", () => {
      expect(okResult.isOk()).toBe(true);
    });
    it("should return false on Err instance", () => {
      expect(errResult.isOk()).toBe(true);
    });
  });

  test("Ok", () => {
    it("should return true", () => {
      expect(ok.isOk()).toBe(true);
    });
  });

  test("Err", () => {
    it("should return false", () => {
      expect(err.isOk()).toBe(false);
    });
  });
});

describe(".isErr", () => {
  test("Result", () => {
    it("should return false on Ok instance", () => {
      expect(okResult.isErr()).toBe(false);
    });
    it("should return true on Err instance", () => {
      expect(errResult.isErr()).toBe(true);
    });
  });

  test("Ok", () => {
    it("should return false", () => {
      expect(ok.isErr()).toBe(false);
    });
  });

  test("Err", () => {
    it("should return true", () => {
      expect(err.isErr()).toBe(true);
    });
  });
});

describe(".onOk", () => {
  test("Result", () => {
    it("should ALWAYS call function when called on Ok instane", () => {
      const effect = vi.fn;
      okResult.onOk(effect);
      expect(effect).toBeCalled();
      expect(effect).toBeCalledWith(okInner);
    });

    it("should NEVER call function when called on Err instane", () => {
      const effect = vi.fn;
      errResult.onOk(effect);
      expect(effect).not.toBeCalled();
    });
  });

  test("Ok", () => {
    it("should call function", () => {
      const effect = vi.fn;
      okResult.onOk(effect);
      expect(effect).toBeCalled();
    });
    it("should call function w/ inner value as arg", () => {
      const effect = vi.fn;
      okResult.onOk(effect);
      expect(effect).toBeCalledWith(okInner);
    });
  });

  test("Err", () => {
    it("should not call function", () => {
      const effect = vi.fn;
      errResult.onOk(effect);
      expect(effect).not.toBeCalled();
    });
  });
});

describe(".onErr", () => {
  test("Result", () => {
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

  test("Ok", () => {
    it("should not call function", () => {
      const effect = vi.fn();
      okResult.onErr(effect);
      expect(effect).not.toBeCalled();
    });
  });

  test("Err", () => {
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
  const mapper = vi.fn(value => value * 2);

  test("Result", () => {
    it("should transform the value when called on Ok instance", () => {
      const mappedResult = okResult.map(mapper);
      expect(mapper).toBeCalled();
      expect(mapper).toBeCalledWith(okInner);
      expect(mappedResult).toBeInstanceOf(Ok);
      expect(mappedResult.take()).toBe(okInner * 2);
    });

    it("should not transform the value when called on Err instance", () => {
      const mappedResult = errResult.map(mapper);
      expect(mapper).not.toBeCalled();
      expect(mappedResult).toBeInstanceOf(Err);
      expect(mappedResult.takeErr()).toBe(errInner);
    });
  });

  test("Ok", () => {
    it("should transform the inner value", () => {
      const mappedResult = ok.map(mapper);
      expect(mapper).toBeCalledWith(okInner);
      expect(mappedResult.value).toBe(okInner * 2);
    });
  });

  test("Err", () => {
    it("should not transform the inner value", () => {
      const mappedResult = err.map(mapper);
      expect(mapper).not.toBeCalled();
      expect(mappedResult.error).toBe(errInner);
    });
  });
});

describe(".chain", () => {
  const chainFnFn = (type: "ok" | "err") =>
    type === "ok"
      ? vi.fn(value => Result.Ok(value * 2))
      : vi.fn(_ => Result.Err<CustomError>("A"));

  test("Result", () => {
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

// describe(".method", () => {
//   test("Result", () => {})
//   test("Ok", () => {});
//   test("Err", () => {});
// });
