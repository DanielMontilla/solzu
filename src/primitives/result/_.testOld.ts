// import { describe, it, expect, vi, expectTypeOf } from "vitest";
// import {
//   None,
//   Some,
//   Result,
//   Err,
//   Ok,
//   EMPTY,
//   Empty,
//   NOOF,
//   Guard,
//   Assertion,
// } from "../..";

// describe("Result", () => {
//   enum CustomEnumError {
//     Error1,
//     Error2,
//   }
//   type CustomLiteralError = "Error1" | "Error2";
//   describe(".takeOk", () => {
//     it("should only throw error if called on Err instance", () => {
//       const ok = Result.Ok();
//       const err = Result.Err();
//       expect(() => ok.take()).not.toThrow();
//       expect(() => err.take()).toThrow();
//     });

//     it("should return inner Ok value if called on Ok instance", () => {
//       const value = "success";
//       const ok = Result.Ok(value);
//       expect(ok.take()).toBe(value);
//     });

//     it("should return inner Ok value even when empty", () => {
//       const ok = Result.Ok();
//       expect(ok.take()).toBe(EMPTY);
//     });

//     it("should be never is called on Err instance", () => {
//       const err = Result.Err();
//       type Test = ReturnType<typeof err.take>;
//       type Expected = never;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should always infer correct return type if called on Ok instance", () => {
//       const ok = Result.Ok("my string");
//       type Test = ReturnType<typeof ok.take>;
//       type Expected = string;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should not infer Ok value type even when unknow Result instance", () => {
//       const result = Result.Of("ok");
//       type Test = ReturnType<typeof result.takeOk>;
//       type Expected = Empty;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });
//   });

//   describe(".takeErr", () => {
//     it("should only throw error if called on Ok instance", () => {
//       const ok = Result.Ok();
//       const err = Result.Err();
//       expect(() => err.takeErr()).not.toThrow();
//       expect(() => ok.takeErr()).toThrow();
//     });

//     it("should return inner Err value if called on Err instance", () => {
//       const error = "failure";
//       const err = Result.Err(error);
//       expect(err.takeErr()).toBe(error);
//     });

//     it("should return inner Err value even when empty", () => {
//       const err = Result.Err();
//       expect(err.takeErr()).toBe(EMPTY);
//     });

//     it("should be never if called on Ok instance", () => {
//       const ok = Result.Ok();
//       type Test = ReturnType<typeof ok.takeErr>;
//       type Expected = never;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should always infer correct return type if called on Err instance", () => {
//       const err = Result.Err("my error");
//       type Test = ReturnType<typeof err.takeErr>;
//       type Expected = string;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should not infer Err value type even when unknown Result instance", () => {
//       type CustomError = "CustomError";
//       const result = Result.Of<number, CustomError>("err", "CustomError");
//       type Test = ReturnType<typeof result.takeErr>;
//       type Expected = CustomError;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });
//   });

//   describe(".isOk", () => {
//     it("should return true if Result is Ok", () => {
//       const ok = Result.Of("ok", "Success");
//       expect(ok.isOk()).toBe(true);
//     });

//     it("should return false if Result is Err", () => {
//       const err = Result.Of("err", "Error");
//       expect(err.isOk()).toBe(false);
//     });

//     it("should allow type narrowing when Result is Ok", () => {
//       const value = "Success";
//       const result = Result.Of("ok", value);
//       if (result.isOk()) {
//         expect(result.value).toBe(value);
//       }
//     });
//   });

//   describe(".isErr", () => {
//     it("should return true if Result is Err", () => {
//       const err = Result.Of("err", "Error");
//       expect(err.isErr()).toBe(true);
//     });

//     it("should return false if Result is Ok", () => {
//       const ok = Result.Of("ok", "Success");
//       expect(ok.isErr()).toBe(false);
//     });

//     it("should allow type narrowing when Result is Err", () => {
//       const result = Result.Of("err", "Error");
//       if (result.isErr()) {
//         expect(result.error).toBe("Error");
//       }
//     });
//   });

//   describe(".onOk", () => {
//     it("should perform the effect if Result is Ok", () => {
//       const mockEffect = vi.fn();
//       const okResult = Result.Ok("Success");
//       okResult.onOk(mockEffect);
//       expect(mockEffect).toHaveBeenCalledWith("Success");
//     });

//     it("should not perform the effect if Result is Err", () => {
//       const mockEffect = vi.fn();
//       const errResult = Result.Err("Error");
//       errResult.onOk(mockEffect);
//       expect(mockEffect).not.toHaveBeenCalled();
//     });

//     it("should return the original Result for chaining", () => {
//       const okResult = Result.Ok("Success");
//       const chainedResult = okResult.onOk(NOOF);
//       expect(chainedResult).toBe(okResult);
//     });

//     it("should always return Ok if called on Ok", () => {
//       const ok = Result.Ok().onOk(NOOF);
//       type Test = typeof ok;
//       type Expected = Ok<Empty>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should always return Err if called on Err", () => {
//       const err = Result.Err().onOk(NOOF);
//       type Test = typeof err;
//       type Expected = Err<Empty>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });
//   });

//   describe(".onErr", () => {
//     it("should perform the effect if Result is Err", () => {
//       const mockEffect = vi.fn();
//       const errResult = Result.Err("Error");
//       errResult.onErr(mockEffect);
//       expect(mockEffect).toHaveBeenCalledWith("Error");
//     });

//     it("should not perform the effect if Result is Ok", () => {
//       const mockEffect = vi.fn();
//       const okResult = Result.Ok("Success");
//       okResult.onErr(mockEffect);
//       expect(mockEffect).not.toHaveBeenCalled();
//     });

//     it("should return the original Result for chaining", () => {
//       const errResult = Result.Err("Error");
//       const chainedResult = errResult.onErr(NOOF);
//       expect(chainedResult).toBe(errResult);
//     });

//     it("should always return Ok if called on Ok", () => {
//       const ok = Result.Ok().onErr(NOOF);
//       type Test = typeof ok;
//       type Expected = Ok<Empty>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should always return Err if called on Err", () => {
//       const err = Result.Err().onErr(NOOF);
//       type Test = typeof err;
//       type Expected = Err<Empty>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });
//   });

//   describe(".mapOk", () => {
//     it("should apply the mapper to the Ok value and return a new Ok", () => {
//       const ok = Result.Of("ok", 5);
//       const mappedResult = ok.mapOk(v => v * 2);
//       expect(mappedResult).toBeInstanceOf(Ok);
//       expect(mappedResult.takeOk()).toBe(10);
//     });

//     it("should not apply the mapper and return the original Err", () => {
//       const err = Result.Of<number, string>("err", "Error");
//       const mappedResult = err.mapOk(value => value * 2);
//       expect(mappedResult).toBeInstanceOf(Err);
//       expect(mappedResult.takeErr()).toBe("Error");
//     });

//     it("should always have return type of Ok when called on Ok instance", () => {
//       const ok = Result.Ok(5);
//       const mappedResult = ok.mapOk(value => value);

//       type Test = typeof mappedResult;
//       type Expected = Ok<number>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should always have return type of Ok<To> when called on Ok instance", () => {
//       const ok = Result.Ok(5);
//       const mappedResult = ok.mapOk(value => `${value}`);

//       type Test = typeof mappedResult;
//       type Expected = Ok<string>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should always have return type of Err when called on Err instance", () => {
//       const err = Result.Err();
//       const mappedResult = err.mapOk(value => `${value}`);

//       type Test = typeof mappedResult;
//       type Expected = Err<Empty>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });
//   });

//   describe(".mapErr", () => {
//     it("should apply the mapper to the Err value and return a new Err", () => {
//       const err = Result.Of<number, number>("err", 10);
//       const mappedResult = err.mapErr(error => error * 2);
//       expect(mappedResult).instanceOf(Err);
//       expect(mappedResult.takeErr()).toBe(20);
//     });

//     it("should not apply the mapper and return the original Ok", () => {
//       const ok = Result.Of("ok", "Success");
//       const mappedResult = ok.mapErr(error => `Mapped: ${error}`);
//       expect(mappedResult).instanceOf(Ok);
//       expect(mappedResult.takeOk()).toBe("Success");
//     });

//     it("should always have return type of Ok when called on Ok instance", () => {
//       const ok = Result.Ok(5);
//       const mappedResult = ok.mapErr(value => value);

//       type Test = typeof mappedResult;
//       type Expected = Ok<number>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should always have return type of Err<To> when called on Err instance", () => {
//       const err = Result.Err();
//       const mappedResult = err.mapErr(_ => `new error`);

//       type Test = typeof mappedResult;
//       type Expected = Err<string>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should always have return type of Err when called on Err instance", () => {
//       const err = Result.Err();
//       const mappedResult = err.mapErr(value => `${value}`);

//       type Test = typeof mappedResult;
//       type Expected = Err<string>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });
//   });

//   describe(".checkOk", () => {
//     describe("@overload when called with just a predicate", () => {
//       it("should return the original Ok if the predicate is satisfied", () => {
//         const ok = Result.Of("ok", 10);
//         const checkedResult = ok.checkOk(value => value > 5);
//         expect(checkedResult.isOk()).toBe(true);
//         expect(checkedResult.takeOk()).toBe(10);
//       });

//       it("should return Err with Empty if the predicate is not satisfied", () => {
//         const ok = Result.Of("ok", 3);
//         const checkedResult = ok.checkOk(value => value > 5);
//         expect(checkedResult.isErr()).toBe(true);
//       });

//       it("should always return Err if original result is err", () => {
//         const err = Result.Of<number>("err");
//         const checkedResult = err.checkOk(_ => true);
//         expect(checkedResult).instanceOf(Err);
//       });

//       it("should go from Ok to Result on Ok instances", () => {
//         const ok = Result.Ok(10);
//         const checkedResult = ok.checkOk(value => value > 5);

//         type Test = typeof checkedResult;
//         type Expected = Result<number, Empty>;

//         expectTypeOf<Test>().toMatchTypeOf<Expected>();
//       });

//       it("should remain Err if initial Result is Err", () => {
//         const err = Result.Err();
//         const checkedResult = err.checkOk(value => value > 5);

//         type Test = typeof checkedResult;
//         type Expected = Err<Empty>;

//         // @ts-expect-error // TODO: make it so this tests passes
//         expectTypeOf<Test>().toMatchTypeOf<Expected>();
//       });
//     });

//     describe("@overload when called with a predicate and an error", () => {
//       it("should return the original Ok if the predicate is satisfied", () => {
//         const ok = Result.Of("ok", 10);
//         const checkedResult = ok.checkOk(value => value > 5, "Error");
//         expect(checkedResult.isOk()).toBe(true);
//         expect(checkedResult.takeOk()).toBe(10);
//       });

//       it("should return Err with the provided error if the predicate is not satisfied", () => {
//         const ok = Result.Of("ok", 3);
//         const checkedResult = ok.checkOk(value => value > 5, "Custom Error");
//         expect(checkedResult).instanceOf(Err);
//         expect(checkedResult.takeErr()).toBe("Custom Error");
//       });

//       it("should return union of previos and new error for return type", () => {
//         const ok = Result.Of("ok", 3);
//         const checkedResult = ok.checkOk(value => value > 5, "my custom error");

//         type Test = typeof checkedResult;
//         type Expected = Result<number, Empty | string>;

//         expectTypeOf<Test>().toMatchTypeOf<Expected>();
//       });
//     });
//   });

//   describe(".assertOk", () => {
//     const isNumber: Assertion<any, number> = (value: any): value is number =>
//       typeof value === "number";

//     describe("@overload when called with just a guard", () => {
//       it("should return the original Ok if the guard is satisfied", () => {
//         const ok = Result.Of("ok", 10).assertOk(isNumber);
//         expect(ok.isOk()).toBe(true);
//         expect(ok.takeOk()).toBe(10);
//       });

//       it("should return Err with Empty if the guard is not satisfied", () => {
//         const ok = Result.Of<any>("ok", "not a number").assertOk(isNumber);
//         expect(ok.isErr()).toBe(true);
//       });

//       it("should turn Result<V, E> to Result<To, V>", () => {
//         const ok = Result.Of<any>("ok", "not a number").assertOk(isNumber);

//         type Test = typeof ok;
//         type Expected = Result<number, Empty>;

//         expectTypeOf<Test>().toMatchTypeOf<Expected>();
//       });

//       it("should turn Ok<V> into to Result<To, E>", () => {
//         const ok = Result.Ok().assertOk<any>(isNumber);

//         type Test = typeof ok;
//         type Expected = Result<number, Empty>;

//         expectTypeOf<Test>().toMatchTypeOf<Expected>();
//       });

//       it("should not be allowed on Err instances", () => {
//         // @ts-expect-error
//         const err = Result.Err().assertOk(isNumber);
//       });

//       it("should error when single template param is given that doesn't match guard generic", () => {
//         // @ts-expect-error
//         Result.Ok("10").assertOk<string>(isNumber);
//       });
//     });

//     describe("@overload when called with a guard and an error", () => {
//       it("should return the original Ok if the guard is satisfied", () => {
//         const ok = Result.Of("ok", 10).assertOk(isNumber, "Not a number");
//         expect(ok.isOk()).toBe(true);
//         expect(ok.takeOk()).toBe(10);
//       });

//       it("should return Err with the provided error if the guard is not satisfied", () => {
//         const ok = Result.Of<any>("ok", "not a number").assertOk(
//           isNumber,
//           "Not a number"
//         );
//         expect(ok.isErr()).toBe(true);
//         expect(ok.takeErr()).toBe("Not a number");
//       });

//       it("should turn Ok<V> or Err<E> into to Result<To, E | Ex>", () => {
//         const ok = Result.Of("ok", 10).assertOk(isNumber, "not a number");

//         type TestOk = typeof ok;
//         type ExpectedOk = Result<number, Empty | string>;

//         expectTypeOf<TestOk>().toMatchTypeOf<ExpectedOk>();

//         const err = Result.Of<any, CustomEnumError>(
//           "err",
//           CustomEnumError.Error1
//         ).assertOk(isNumber, "not a number");

//         type TestErr = typeof err;
//         type ExpectedErr = Result<number, string | CustomEnumError>;

//         expectTypeOf<TestErr>().toMatchTypeOf<ExpectedErr>();
//       });
//     });
//   });

//   describe(".unfold", () => {
//     enum ErrorA {
//       Error,
//     }
//     enum ErrorB {
//       Error,
//     }

//     it("should turn 2D nested Ok into 1D Ok Result", () => {
//       const result = Result.Of("ok", Result.Of("ok", 10)).unfold();
//       expect(result).toBeInstanceOf(Ok);
//       expect(result.takeOk()).toBe(10);
//     });

//     it("should turn nested Err in Ok into that Err", () => {
//       const err = Result.Of("err", ErrorA.Error);
//       const result = Result.Of("ok", err).unfold();
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(ErrorA.Error);
//     });

//     it("return should merge errors", () => {
//       const err = Result.Of<number, ErrorA>("ok", 10);
//       const result = Result.Of<typeof err, ErrorB>("ok", err).unfold();

//       type Test = typeof result;
//       type Expected = Result<number, ErrorA | ErrorB>;

//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should return Ok<V> when called on Ok instance", () => {
//       const ok = Result.Ok().unfold();

//       type Test = typeof ok;
//       type Expected = Ok<Empty>;
//       // @ts-expect-error // TODO: MAKE THIS WORK
//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });

//     it("should return Err<E> when called on Err instance", () => {
//       const err = Result.Err().unfold();

//       type Test = typeof err;
//       type Expected = Err<Empty>;
//       // @ts-expect-error // TODO: MAKE THIS WORK
//       expectTypeOf<Test>().toMatchTypeOf<Expected>();
//     });
//   });

//   describe(".or", () => {
//     it("should return the original Ok Result regardless of chained results when called on Ok", () => {
//       const ok = Result.Of("ok", "Success");
//       const okAlt = Result.Of("ok", "Alternative");

//       const result1 = ok.or(okAlt);

//       expect(result1).instanceOf(Ok);
//       expect(result1.takeOk()).toBe("Success");

//       const errAlt = Result.Of("err", "Error");
//       const result2 = ok.or(errAlt);

//       expect(result2).instanceOf(Ok);
//       expect(result2.takeOk()).toBe("Success");
//     });

//     it("should return alt Result when called on Err", () => {
//       const err = Result.Of("err", "Error A");
//       const alt = Result.Of("ok", "Alternative");

//       const result = err.or(alt);

//       expect(result).instanceOf(Ok);
//       expect(result.takeOk()).toBe("Alternative");
//     });

//     it("should result in earliest Ok. Otherwise the last Err", () => {
//       const err = Result.Of("err", "Error A");
//       const errAlt1 = Result.Of("err", "Error B");
//       const errAlt2 = Result.Of("err", "Error C");
//       const errAlt3 = Result.Of("err", "Error D");
//       const okAlt = Result.Of("ok", "Alternative");

//       const resultA = err.or(errAlt1).or(errAlt2).or(errAlt3);

//       expect(resultA).toBeInstanceOf(Err);
//       expect(resultA.takeErr()).toBe("Error D");

//       const resultB = err.or(errAlt1).or(errAlt2).or(errAlt3).or(okAlt);

//       expect(resultB).toBeInstanceOf(Ok);
//       expect(resultB.takeOk()).toBe("Alternative");

//       const resultC = err.or(errAlt1).or(okAlt).or(errAlt2).or(errAlt3);

//       expect(resultC).toBeInstanceOf(Ok);
//       expect(resultC.takeOk()).toBe("Alternative");
//     });

//     it("should work with Result and Result returning functions", () => {
//       const err = () => Result.Of("err", "Error A");
//       const errAlt1 = () => Result.Of("err", "Error B");
//       const errAlt2 = () => Result.Of("err", "Error C");
//       const errAlt3 = () => Result.Of("err", "Error D");
//       const okAlt = () => Result.Of("ok", "Alternative");

//       const resultA = err().or(errAlt1).or(errAlt2).or(errAlt3);

//       expect(resultA).toBeInstanceOf(Err);
//       expect(resultA.takeErr()).toBe("Error D");

//       const resultB = err().or(errAlt1).or(errAlt2).or(errAlt3).or(okAlt);

//       expect(resultB).toBeInstanceOf(Ok);
//       expect(resultB.takeOk()).toBe("Alternative");

//       const resultC = err().or(errAlt1).or(okAlt).or(errAlt2).or(errAlt3);

//       expect(resultC).toBeInstanceOf(Ok);
//       expect(resultC.takeOk()).toBe("Alternative");
//     });

//     it("should generate a unions type of all the Results. Regardless of order", () => {
//       type ResultA = Result<"OkA", "ErrorA">;
//       type ResultB = Result<"OkB", "ErrorB">;
//       type ResultC = Result<"OkC", "ErrorC">;
//       type ResultD = Result<"OkD", "ErrorD">;
//       type ResultE = Result<"OkE", "ErrorE">;

//       const resultA: ResultA = Result.Of("err", "ErrorA");
//       const resultB: ResultB = Result.Of("ok", "OkB");
//       const resultC: ResultC = Result.Of("err", "ErrorC");
//       const resultD: ResultD = Result.Of("ok", "OkD");
//       const resultE: ResultE = Result.Of("err", "ErrorE");

//       const finalA = resultA.or(resultB).or(resultC).or(resultD).or(resultE);
//       type Expected = ResultA | ResultB | ResultC | ResultD | ResultE;

//       type TestA = typeof finalA;

//       expectTypeOf<TestA>().toEqualTypeOf<Expected>();

//       const finalB = resultB.or(resultA).or(resultE).or(resultD).or(resultC);

//       type TestB = typeof finalB;

//       expectTypeOf<TestB>().toEqualTypeOf<Expected>();
//     });
//   });

//   describe(".toEither", () => {
//     it("should convert Ok to Left", () => {
//       const ok = Result.Ok("Success");
//       const either = ok.toEither();
//       expect(either.isLeft()).toBe(true);
//     });

//     it("should convert Err to Right", () => {
//       const err = Result.Err("Error");
//       const either = err.toEither();
//       expect(either.isRight()).toBe(true);
//     });
//   });

//   describe(".toOption", () => {
//     it("should convert Ok to Some", () => {
//       const okResult = Result.Ok("Success");
//       const option = okResult.toOption();
//       expect(option).toBeInstanceOf(Some);
//       expect(option.value).toBe("Success");
//     });

//     it("should convert Err to None", () => {
//       const errResult = Result.Err("Failure");
//       const option = errResult.toOption();
//       expect(option).toBeInstanceOf(None);
//     });
//   });

//   describe("Factory Methods", () => {
//     describe(".Ok", () => {
//       describe("@overload when called with value", () => {
//         it("should return an Ok result containing the value", () => {
//           const value = "test";
//           const result = Result.Ok(value);
//           expect(result.isOk()).toBe(true);
//           expect(result.value).toBe(value);
//         });

//         it("should infer correct inner value type", () => {
//           const value = 0;
//           const ok = Result.Ok(value);
//           type Test = typeof ok;
//           type Expected = Ok<number>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });

//       describe("@overload when called without a value", () => {
//         it("should return an Ok result containing an empty value", () => {
//           const result = Result.Ok();
//           expect(result.isOk()).toBe(true);
//           expect(result.value).toBe(EMPTY);
//         });

//         it("should always have Empty inner value type", () => {
//           const ok = Result.Ok();
//           type Test = typeof ok;
//           type Expected = Ok<Empty>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });

//       it("should require value if generic is provided", () => {
//         // @ts-expect-error
//         Result.Ok<number>();
//       });
//     });

//     describe(".Err", () => {
//       describe("@overload when called with value", () => {
//         it("should return an Err result containing the error", () => {
//           const error = "error message";
//           const result = Result.Err(error);
//           expect(result.isErr()).toBe(true);
//           expect(result.error).toBe(error);
//         });

//         it("should infer correct inner error type", () => {
//           const error = new Error("error");
//           const err = Result.Err(error);
//           type Test = typeof err;
//           type Expected = Err<Error>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });

//       describe("@overload when called without a value", () => {
//         it("should return an Err result containing an empty value", () => {
//           const result = Result.Err();
//           expect(result.isErr()).toBe(true);
//           expect(result.error).toBe(EMPTY);
//         });

//         it("should always have Empty inner error type", () => {
//           const err = Result.Err();
//           type Test = typeof err;
//           type Expected = Err<Empty>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });

//         it("should type the inner error type as union of Empty and provided generic", () => {
//           const err = Result.Err<number>();
//           type Test = typeof err;
//           type Expected = Err<Empty | number>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });
//     });

//     describe(".Of", () => {
//       describe("@overload when called without arguments", () => {
//         it("should return a instance of Result", () => {
//           const result = Result.Of();
//           expect(result).toBeInstanceOf(Result);
//         });

//         it("should be Ok<Empty>", () => {
//           const result = Result.Of();
//           expect(() => result.takeOk()).not.toThrow();
//           expect(result.takeOk()).toBe(EMPTY);
//         });

//         it("should not allow generic without providing relevant values", () => {
//           // @ts-expect-error
//           Result.Of<number>();

//           // @ts-expect-error
//           Result.Of<boolean, CustomEnumError>();
//         });

//         it("should be of type Result<Empty, Empty>", () => {
//           const result = Result.Of();
//           type Test = typeof result;
//           type Expected = Result<Empty, Empty>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });

//       describe("@overload when called with 'err' kind and no error value", () => {
//         it("should return a instance of Err", () => {
//           const result = Result.Of("err");
//           expect(result).toBeInstanceOf(Err);
//         });

//         it("should be Err<Empty>", () => {
//           const result = Result.Of("err");
//           expect(() => result.takeErr()).not.toThrow();
//           expect(result.takeErr()).toBe(EMPTY);
//         });

//         it("should be of type Result<Empty, Empty> when no generics provided", () => {
//           const result = Result.Of("err");
//           type Test = typeof result;
//           type Expected = Result<Empty, Empty>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });

//         it("should be of type Result<V, MyError | Empty> when template is provided", () => {
//           const result = Result.Of<number, CustomEnumError>("err");
//           type Test = typeof result;
//           type Expected = Result<number, CustomEnumError | Empty>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });

//       describe("@overload when called with 'err' kind and error provided", () => {
//         it("should return an Err result instance", () => {
//           const result = Result.Of("err", CustomEnumError.Error1);
//           expect(result).toBeInstanceOf(Err);
//         });

//         it("should return an Err with provided error value", () => {
//           const result = Result.Of("err", CustomEnumError.Error1);
//           expect(() => result.takeErr()).not.toThrow();
//           expect(result.takeErr()).toBe(CustomEnumError.Error1);
//         });

//         it("should infer correct inner error type", () => {
//           const err = Result.Of("err", "my error");
//           type Test = typeof err;
//           type Expected = Result<Empty, string>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });

//       describe("@overload when called with 'ok' kind and no value", () => {
//         it("should return a instance of Ok", () => {
//           const result = Result.Of("ok");
//           expect(result).toBeInstanceOf(Ok);
//         });

//         it("should be Ok<Empty>", () => {
//           const result = Result.Of("ok");
//           expect(() => result.takeOk()).not.toThrow();
//           expect(result.takeOk()).toBe(EMPTY);
//         });

//         it("should be of type Result<Empty, Empty> when no generics provided", () => {
//           const result = Result.Of("ok");
//           type Test = typeof result;
//           type Expected = Result<Empty, Empty>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });

//         it("should be of type Result<Empty, E | Empty> when E generic provided", () => {
//           const result = Result.Of<CustomEnumError>("ok");
//           type Test = typeof result;
//           type Expected = Result<Empty, Empty | CustomEnumError>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });

//       describe("@overload when called with 'ok' kind and value provided", () => {
//         it("should return an Ok instance", () => {
//           const value = 123;
//           const result = Result.Of("ok", value);
//           expect(result).toBeInstanceOf(Ok);
//         });

//         it("should return an Ok result containing the value", () => {
//           const value = 123;
//           const result = Result.Of("ok", value);
//           expect(() => result.takeOk()).not.toThrow();
//           expect(result.takeOk()).toBe(value);
//         });

//         it("should infer correct inner value type", () => {
//           const value = 123;
//           const ok = Result.Of("ok", value);
//           type Test = typeof ok;
//           type Expected = Result<number, Empty>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });

//         it("should be correct type if generics provided", () => {
//           const value = 123;
//           const ok = Result.Of<number, CustomLiteralError>("ok", value);
//           type Test = typeof ok;
//           type Expected = Result<number, CustomLiteralError>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });

//         it("should error if types mismatch", () => {
//           // @ts-expect-error
//           const ok = Result.Of<string>("ok", 123);
//         });
//       });
//     });

//     describe.concurrent(".FromPromise", () => {
//       describe("@overload when called with just a promise or promise-returning function", () => {
//         it("should return Ok with the resolved value for a resolving promise", async ({
//           expect,
//         }) => {
//           const promise = Promise.resolve("Success");
//           const result = await Result.FromPromise(promise);
//           expect(result).toBeInstanceOf(Ok);
//           expect(result.take()).toBe("Success");
//         });

//         it("should return Err with the error for a rejecting promise", async ({
//           expect,
//         }) => {
//           const promise = Promise.reject(new Error("Failure"));
//           const result = await Result.FromPromise(promise);
//           expect(result).toBeInstanceOf(Err);
//         });

//         it("should return Ok with the resolved value for a resolving promise-returning function", async ({
//           expect,
//         }) => {
//           const promiseFunc = () => Promise.resolve("Success from function");
//           const result = await Result.FromPromise(promiseFunc);
//           expect(result).toBeInstanceOf(Ok);
//           expect(result.take()).toBe("Success from function");
//         });

//         it("should return Err with the error for a rejecting promise-returning function", async ({
//           expect,
//         }) => {
//           const promiseFunc = () =>
//             Promise.reject(new Error("Failure from function"));
//           const result = await Result.FromPromise(promiseFunc);
//           expect(result).toBeInstanceOf(Err);
//         });

//         it("should return inner type Result<V, unknown> when using promise", async () => {
//           const promise = Promise.resolve(123);
//           const result = await Result.FromPromise(promise);

//           type Test = typeof result;
//           type Expected = Result<number, unknown>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });

//         it("should return inner type Result<V, unknown> when using promise-return function", async () => {
//           const result = await Result.FromPromise(async () => 10);

//           type Test = typeof result;
//           type Expected = Result<number, unknown>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });

//       describe("@overload when called with a promise or function-returning promise and an error mapper", () => {
//         it("should return Ok with the resolved value for a resolving promise", async ({
//           expect,
//         }) => {
//           const promise = Promise.resolve("Success");
//           const result = await Result.FromPromise(promise, e => `Mapped: ${e}`);
//           expect(result).toBeInstanceOf(Ok);
//           expect(result.take()).toBe("Success");
//         });

//         it("should return Err with the mapped error for a rejecting promise", async ({
//           expect,
//         }) => {
//           const error = new Error("Failure");
//           const errorMapper = (e: unknown) => `Mapped: ${e}`;
//           const promise = Promise.reject(error);
//           const result = await Result.FromPromise(promise, errorMapper);
//           expect(result).toBeInstanceOf(Err);
//           expect(result.takeErr()).toBe(`Mapped: ${error}`);
//         });

//         it("should return Ok with the resolved value for a resolving promise-returning function", async ({
//           expect,
//         }) => {
//           const promiseFunc = () => Promise.resolve("Success from function");
//           const result = await Result.FromPromise(
//             promiseFunc,
//             e => `Mapped: ${e}`
//           );
//           expect(result).toBeInstanceOf(Ok);
//           expect(result.take()).toBe("Success from function");
//         });

//         it("should return Err with the mapped error for a rejecting promise-returning function", async ({
//           expect,
//         }) => {
//           const error = new Error("Failure from function");
//           const promiseFunc = () => Promise.reject(error);
//           const errorMapper = (e: unknown) => `Mapped: ${e}`;
//           const result = await Result.FromPromise(promiseFunc, errorMapper);
//           expect(result).toBeInstanceOf(Err);
//           expect(result.takeErr()).toBe(`Mapped: ${error}`);
//         });

//         it("should return inner type Result<V, E> with promise", async () => {
//           const promise = Promise.resolve(123);
//           const result = await Result.FromPromise(
//             promise,
//             _ => CustomEnumError.Error1
//           );

//           type Test = typeof result;
//           type Expected = Result<number, CustomEnumError>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });

//         it("should return inner type Result<V, E> with promise-returning function", async () => {
//           const result = await Result.FromPromise(
//             async () => 123,
//             _ => CustomEnumError.Error1
//           );

//           type Test = typeof result;
//           type Expected = Result<number, CustomEnumError>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });
//     });

//     describe(".FromTryCatch", () => {
//       describe("@overload when called with just a function", () => {
//         it("should return Ok with the function's return value", () => {
//           const fn = () => "Success";
//           const result = Result.FromTryCatch(fn);
//           expect(result.isOk()).toBe(true);
//           expect(result.take()).toBe("Success");
//         });

//         it("should return Err with the error if the function throws", () => {
//           const fn = () => {
//             throw new Error("Failure");
//           };
//           const result = Result.FromTryCatch(fn);
//           expect(result.isErr()).toBe(true);
//         });

//         it("should return inner type Result<V, unknown>", () => {
//           const fn = () => 123;
//           const result = Result.FromTryCatch(fn);

//           type Test = typeof result;
//           type Expected = Result<number, unknown>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });

//       describe("@overload when called with a function and an error mapper", () => {
//         it("should return Ok with the function's return value", () => {
//           const fn = () => "Success";
//           const result = Result.FromTryCatch(fn, e => `Mapped: ${e}`);
//           expect(result.isOk()).toBe(true);
//           expect(result.take()).toBe("Success");
//         });

//         it("should return Err with the mapped error if the function throws", () => {
//           const error = new Error("Failure");
//           const fn = () => {
//             throw error;
//           };
//           const errorMapper = (e: unknown) => `Mapped: ${e}`;
//           const result = Result.FromTryCatch(fn, errorMapper);
//           expect(result.isErr()).toBe(true);
//           expect(result.takeErr()).toBe(`Mapped: ${error}`);
//         });

//         it("should return inner type Result<V, E>", () => {
//           const fn = () => 123;
//           const errorMapper = (e: unknown) => `Mapped: ${e}`;
//           const result = Result.FromTryCatch(fn, errorMapper);

//           type Test = typeof result;
//           type Expected = Result<number, string>;

//           expectTypeOf<Test>().toMatchTypeOf<Expected>();
//         });
//       });
//     });
//   });
// });
