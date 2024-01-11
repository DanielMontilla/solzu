import { describe, test, it, expect } from "vitest";
import {
  ok,
  okInner,
  errResult,
  okResult,
  err,
  errInner,
} from "./@common.test";
import { Result } from "../..";

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

// describe(".method", () => {
//   test("Result", () => {})
//   test("Ok", () => {});
//   test("Err", () => {});
// });
