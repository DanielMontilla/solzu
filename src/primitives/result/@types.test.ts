import { describe, test, it, expectTypeOf } from "vitest";
import {
  CustomError,
  CustomErrorEnum,
  ErrInner,
  ErrTest,
  OkInner,
  OkTest,
  ResultTest,
  result,
} from "./@common.test";
import { Empty, Err, HasNArgs, Never, NthArgOf, Ok, Result } from "../..";

describe(".take", () => {
  test("Result", () => {
    type Test = ReturnType<ResultTest["take"]>;
    type Expected = OkInner;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Ok", () => {
    type Test = ReturnType<OkTest["take"]>;
    type Expected = OkInner;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Err", () => {
    type Test = ReturnType<ErrTest["take"]>;
    type Expected = Never;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });
});

describe(".takeErr", () => {
  test("Result", () => {
    type Test = ReturnType<ResultTest["takeErr"]>;
    type Expected = ErrInner;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Ok", () => {
    type Test = ReturnType<OkTest["takeErr"]>;
    type Expected = Never;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Err", () => {
    type Test = ReturnType<ErrTest["takeErr"]>;
    type Expected = ErrInner;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });
});

describe(".isOk", () => {
  test("Result", () => {
    it("should return a boolean on unknown instance", () => {
      type Test = ReturnType<ResultTest["isOk"]>;
      type Expected = boolean;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });

    it("should narrow type", () => {
      if (result.isOk()) {
        expectTypeOf<typeof result>().toHaveProperty("value");
      } else {
        expectTypeOf<typeof result>().not.toHaveProperty("value");
      }
    });
  });

  test("Ok", () => {
    type Test = ReturnType<OkTest["isOk"]>;
    type Expected = true;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Err", () => {
    type Test = ReturnType<ErrTest["isOk"]>;
    type Expected = false;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });
});

describe(".isErr", () => {
  test("Result", () => {
    type Test = ReturnType<ResultTest["isErr"]>;
    type Expected = boolean;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Ok", () => {
    type Test = ReturnType<OkTest["isErr"]>;
    type Expected = false;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Err", () => {
    type Test = ReturnType<ErrTest["isErr"]>;
    type Expected = true;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });
});

describe(".onOk", () => {
  test("Result", () => {
    it("should have exatcly 1 argument", () => {
      type Test = HasNArgs<ResultTest["onOk"], 1>;
      type Expected = true;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });

    it("should have correct arg[0] type", () => {
      type Test = NthArgOf<ResultTest["onOk"], 0>;
      type Expected = (x: OkInner) => any;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });
  });

  test("Ok", () => {
    type Test = ReturnType<OkTest["onOk"]>;
    type Expected = OkTest;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Err", () => {
    type Test = ReturnType<ErrTest["onOk"]>;
    type Expected = ErrTest;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });
});

describe(".onErr", () => {
  test("Result", () => {
    it("should have exactly 1 argument", () => {
      type Test = HasNArgs<ResultTest["onErr"], 1>;
      type Expected = true;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });

    it("should have correct arg[0] type", () => {
      type Test = NthArgOf<ResultTest["onErr"], 0>;
      type Expected = (e: ErrInner) => any;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });
  });

  test("Ok", () => {
    type Test = ReturnType<OkTest["onErr"]>;
    type Expected = OkTest;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  test("Err", () => {
    type Test = ReturnType<ErrTest["onErr"]>;
    type Expected = ErrTest;

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });
});

describe(".Ok", () => {
  test("@overload when called with value", () => {
    it("should infer correct inner type", () => {
      const test = Result.Ok(0);
      type Test = typeof test;
      type Expected = Ok<number>;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });
    it("should error if provided with mismatch generic and inner type", () => {
      // @ts-expect-error
      const test = Result.Ok<number>("");
    });
  });

  test("@overload when called without value", () => {
    it("should have inner void/Empty type", () => {
      const test = Result.Ok();
      type Test = typeof test;
      type Expected = Ok<Empty>;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });

    it("should error if generic is provided", () => {
      // @ts-expect-error
      const test = Result.Ok<number>();
    });
  });
});

describe(".Ok", () => {
  test("@overload when called with value", () => {
    it("should infer correct inner type", () => {
      const test = Result.Err<CustomError>("A");
      type Test = typeof test;
      type Expected = Err<CustomError>;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });
    it("should error if provided with mismatch generic and inner type", () => {
      // @ts-expect-error
      const test = Result.Err<CustomError>(0);
    });
  });

  test("@overload when called without value", () => {
    it("should have inner void/Empty type", () => {
      const test = Result.Err();
      type Test = typeof test;
      type Expected = Err<Empty>;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });

    it("should be ONLY inner type if generic and value provided match", () => {
      const test = Result.Err<CustomError>("A");

      type Test = typeof test;
      type Expected = Err<CustomError>;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });

    it("should have inner type union of empty and provided generic", () => {
      const test = Result.Err<CustomError>();

      type Test = typeof test;
      type Expected = Err<CustomError | Empty>;

      expectTypeOf<Test>().toEqualTypeOf<Expected>();
    });
  });
});

describe(".FromPromise", () => {
  test("@overload when called with just a promise or promise-returning function", () => {
    it("should return inner type Result<V, unknown> when using promise", async () => {
      const result = await Result.FromPromise(Promise.resolve(123));

      type Test = typeof result;
      type Expected = Result<number, unknown>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });

    it("should return inner type Result<V, unknown> when using promise-return function", async () => {
      const result = await Result.FromPromise(async () => 10);

      type Test = typeof result;
      type Expected = Result<number, unknown>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });

    it("it should error if there is mismatch between generic and arg types", async () => {
      // @ts-expect-error
      await Result.FromPromise<number>(Promise.resolve(""));
    });
  });

  test("@overload when called with a promise or function-returning promise and an error mapper", () => {
    it("should return inner type Result<V, E> with promise", async () => {
      const promise = Promise.resolve(123);
      const result = await Result.FromPromise(promise, _ => CustomErrorEnum.A);

      type Test = typeof result;
      type Expected = Result<number, CustomErrorEnum>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });

    it("should return inner type Result<V, E> with promise-returning function", async () => {
      const result = await Result.FromPromise(
        async () => 123,
        _ => CustomErrorEnum.A
      );

      type Test = typeof result;
      type Expected = Result<number, CustomErrorEnum>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });

    it("it should require 2 arguments when 2 template args provided", async () => {
      // @ts-expect-error
      await Result.FromPromise<number, CustomError>(Promise.resolve(""));
    });
  });
});

describe(".FromTryCatch", () => {
  test("@overload when called with just a function", () => {
    it("should infer inner type as Result<V, unknown>", () => {
      const fn = () => 123;
      const result = Result.FromTryCatch(fn);

      type Test = typeof result;
      type Expected = Result<number, unknown>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });
    it("should expect 2 arguments if provided with 2 template arguments", () => {
      const fn = () => 0;
      // @ts-expect-error
      Result.FromTryCatch<number, CustomError>(fn);
    });
  });
  test("@overload when called with a function and an error mapper", () => {
    it("should infer inner type Result<V, E>", () => {
      const fn = () => 123;
      const errorMapper = (e: unknown) => `Mapped: ${e}`;
      const result = Result.FromTryCatch(fn, errorMapper);

      type Test = typeof result;
      type Expected = Result<number, string>;

      expectTypeOf<Test>().toMatchTypeOf<Expected>();
    });
  });
});
