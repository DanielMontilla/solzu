import { describe, test, it, expectTypeOf } from "vitest";
import {
  ErrInner,
  ErrTest,
  OkInner,
  OkTest,
  ResultTest,
  result,
} from "./@common.test";
import { HasNArgs, Never, NthArgOf } from "../..";

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

// describe(".method", () => {
// describe("type", () => {
//   test("Result", () => {})
//   test("Ok", () => {});
//   test("Err", () => {});
// });
