// export namespace Result {
//   export function ok<T>(value: T) {
//     return new Ok<T>(value);
//   }
//   export function err<T>(error: T) {
//     return new Err<T>(error);
//   }
//   export function res(): Result<Nothing, Nothing> {
//     return ok(nothing());
//   }
//   export abstract class Super<V, E> {
//     protected abstract type: "ok" | "err";

//     public isOk(): this is Ok<V> {
//       return this.type === "ok";
//     }

//     public isErr(): this is Err<E> {
//       return this.type === "err";
//     }
//   }
// }

// export class Ok<V> extends Result.Super<V, Nothing> {
//   protected type: "ok" = "ok";
//   constructor(public readonly value: V) {
//     super();
//   }
// }
// export class Err<E> extends Result.Super<Nothing, E> {
//   protected type: "err" = "err";
//   constructor(public readonly error: E) {
//     super();
//   }
// }

// export type Result<V, E> = Ok<V> | Err<E>;

// mapOk<To = V>(this: Ok<V>, mapper: Mapper<V, To>): Ok<To>;
// mapOk<To = V>(this: Err<E>, mapper: Mapper<V, To>): Err<E>;
// mapOk<To = V>(this: Result<V, E>, mapper: Mapper<V, To>): Result<To, E>;
// mapOk<To = V>(
//   this: Ok<V> | Err<E> | Result<V, E>,
//   mapper: Mapper<V, To>
// ): Ok<To> | Err<E> | Result<To, E> {
//   if (this.isOk()) return Result.Ok(mapper(this.value));
//   // @ts-expect-error
//   return this;
// }

// import {
//   Either,
//   Mapper,
//   None,
//   Option,
//   Predicate_ as Predicate,
//   Guard,
//   Some,
//   AssertEqual,
//   Nothing,
//   Left,
//   Right,
// } from "../..";

// import { nothing } from "../nothing";
// /**
//  * Represents a value that might be a successful result (`Ok`) or an error (`Err`).
//  * It's a way to handle errors or success without throwing exceptions.
//  * @template V - The type of the value for successful results.
//  * @template E - The type of the error for failed results.
//  */
// export abstract class Result<V = Nothing, E = Nothing> {
//   /**
//    * Extracts the `Ok` value directly.
//    * @throws If the `Result` is `Err`.
//    * @returns The `Ok` value.
//    */
//   abstract takeOk(): V;

//   /**
//    * Extracts the `Err` value directly.
//    * @throws If the `Result` is `Ok`.
//    * @returns The `Err` value.
//    */
//   abstract takeErr(): E;

//   /**
//    * Checks if the `Result` is `Ok`.
//    * @returns `true` if `Result` is `Ok`, otherwise `false`.
//    */
//   abstract isOk(): this is Ok<V>;

//   /**
//    * Checks if the `Result` is `Err`.
//    * @returns `true` if `Result` is `Err`, otherwise `false`.
//    */
//   abstract isErr(): this is Err<E>;

//   /**
//    * Performs a side effect when `Result` is `Ok`.
//    * @param effect - The function to execute if `Result` is `Ok`.
//    * @returns The original `Result` for chaining.
//    */ // prettier-ignore
//   public onOk(effect: (value: V) => any):
//       this extends Ok<V> ? Ok<V>
//     : this extends Err<E> ? Err<E>
//     : Result<V, E>
//   {
//     if (this.isOk()) effect(this.value);

//     // @ts-expect-error
//     return this;
//   }

//   /**
//    * Performs a side effect when `Result` is `Err`.
//    * @param effect - The function to execute if `Result` is `Err`.
//    * @returns The original `Result` for chaining.
//    */ // prettier-ignore
//   public onErr(effect: (error: E) => any):
//       this extends Ok<V> ? Ok<V>
//     : this extends Err<E> ? Err<E>
//     : Result<V, E>
//   {
//     if (this.isErr()) effect(this.error);

//     // @ts-expect-error
//     return this;
//   }

//   // prettier-ignore
//   public mapOk<To = V>(mapper: Mapper<V, To>):
//       this extends Ok<V> ? Ok<To>
//     : this extends Err<E> ? Err<E>
//     : Result<To, E>
//   {
//     // @ts-expect-error
//     if (this.isOk()) return Result.Ok(mapper(this.value));
//     // @ts-expect-error
//     return this;
//   }

//   // prettier-ignore
//   mapErr<To = E>(mapper: Mapper<E, To>):
//       this extends Ok<V> ? Ok<V>
//     : this extends Err<E> ? Err<To>
//     : Result<To, E>
//   {
//     // @ts-expect-error
//     if (this.isErr()) return Result.Err(mapper(this.error));

//     // @ts-expect-error
//     return this;
//   }

//   public checkOk(predicate: Predicate<V>): Result<V, E | Nothing>;

//   public checkOk<Ex>(predicate: Predicate<V>, error: Ex): Result<V, E | Ex>;

//   public checkOk<Ex = E>(
//     predicate: Predicate<V>,
//     error?: Ex
//   ): Result<V, E> | Result<V, E | Ex> | Result<V, E | Nothing> {
//     if (this.isErr()) return this; // Result<V, E>
//     if (predicate(this.takeOk())) return this; // Result<V, E | Ex> (Ok variant)
//     return error !== undefined
//       ? Result.Of<V, E | Ex>("err", error) // Result<V, E | Ex> (Err variant)
//       : Result.Of<V, E | Nothing>("err"); // Result<V, E | Nothing>
//   }

//   public assertOk<To>(guard: Guard<To>): Result<To, E | Nothing>;

//   public assertOk<To, Ex = E>(guard: Guard<To>, error: Ex): Result<To, E | Ex>;

//   public assertOk<To, Ex = E>(
//     guard: Guard<To>,
//     error?: Ex
//   ): Result<To, E> | Result<V, E | Ex> | Result<V, E | Nothing> {
//     if (this.isErr()) return this; // Result<To, E>
//     if (guard(this.takeOk())) return this; // Result<V, E | Ex> (Ok variant)
//     return error !== undefined
//       ? Result.Of<V, E | Ex>("err", error) // Result<V, E | Ex> (Err variant)
//       : Result.Of<V, E | Nothing>("err"); // Result<V, E | Nothing>
//   }

//   public unfold(): Result.Unfold<V, E> {
//     const self = this.toUnion();

//     if (self.isErr() || !(self.value instanceof Result))
//       return this as Result.Unfold<V, E>;

//     return self.value.unfold() as Result.Unfold<V, E>;
//   }

//   // prettier-ignore
//   public toEither():
//       this extends Ok<V> ? Left<V>
//     : this extends Err<E> ? Right<E>
//     : Either<V, E>
//   {
//     // @ts-expect-error
//     return this.isOk()
//       ? Either.Left(this.takeOk())
//       : Either.Right(this.takeErr());
//   }

//   // prettier-ignore
//   public toOption():
//       this extends Ok<V> ? Some<V>
//     : this extends Err<E> ? None
//     : Option<V>
//   {
//     // @ts-expect-error
//     return this.isOk()
//       ? Option.Some(this.takeOk())
//       : Option.None();
//   }

//   toUnion(): Result.Union<V, E> {
//     if (this instanceof Ok || this instanceof Err) return this;
//     throw Error(
//       "trying to convert to union a object thats not Ok or Err instance"
//     );
//   }

//   public static Ok<V>(value: V): Ok<V>;
//   public static Ok(): Ok<Nothing>;
//   public static Ok<V>(value?: V): Ok<V> | Ok<V | Nothing> {
//     return value !== undefined
//       ? new Ok<V>(value)
//       : new Ok<V | Nothing>(nothing());
//   }

//   public static Err<E>(error: E): Err<E>;
//   public static Err<E = Nothing>(): Err<E | Nothing>;
//   public static Err<E>(error?: E): Err<E> | Err<E | Nothing> {
//     return error !== undefined
//       ? new Err<E>(error)
//       : new Err<E | Nothing>(nothing());
//   }

//   public static Of(): Result<Nothing, Nothing>;

//   public static Of<V = Nothing, E = Nothing>(
//     kind: "err"
//   ): Result<V, E | Nothing>;

//   public static Of<V = Nothing, E = Nothing>(
//     kind: "ok"
//   ): Result<V, E | Nothing>;

//   public static Of<V = Nothing, E = Nothing>(
//     kind: "ok",
//     content: V
//   ): Result<V, E>;

//   public static Of<V = Nothing, E = Nothing>(
//     kind: "err",
//     content: E
//   ): Result<V, E>;

//   public static Of<V = Nothing, E = Nothing>(
//     kind?: "ok" | "err",
//     content?: V | E
//   ): Result<V, E> {
//     // @ts-expect-error
//     return kind === undefined
//       ? Result.Ok()
//       : kind === "ok"
//         ? content !== undefined
//           ? Result.Ok(content)
//           : Result.Ok()
//         : content !== undefined
//           ? Result.Err(content)
//           : Result.Err();
//   }

//   // TODO: add singular value version

//   public static async FromPromise<V>(
//     promise: Promise<V>
//   ): Promise<Result<V, unknown>>;

//   public static async FromPromise<V, E>(
//     promise: Promise<V>,
//     mapper: Mapper<unknown, E>
//   ): Promise<Result<V, E>>;

//   public static async FromPromise<V, E>(
//     promise: Promise<V>,
//     mapper?: Mapper<unknown, E>
//   ): Promise<Result<V, E> | Result<V, unknown>> {
//     try {
//       return Result.Of<V, E>("ok", await promise);
//     } catch (e) {
//       return mapper
//         ? Result.Of<V, E>("err", mapper(e))
//         : Result.Of<V, unknown>("err", e);
//     }
//   }

//   // TODO: add singular value version

//   public static FromTryCatch<V, E>(
//     fn: () => V,
//     mapper: Mapper<unknown, E>
//   ): Result<V, E>;

//   public static FromTryCatch<V>(fn: () => V): Result<V, unknown>;

//   public static FromTryCatch<V, E>(
//     fn: () => V,
//     mapper?: Mapper<unknown, E>
//   ): Result<V, unknown> | Result<V, E> {
//     try {
//       return Result.Of<V, E>("ok", fn());
//     } catch (e) {
//       return mapper
//         ? Result.Of<V, E>("err", mapper(e))
//         : Result.Of<V, unknown>("err", e);
//     }
//   }
// }

// /**
//  * Represents a successful result, containing a value.
//  */
// export class Ok<V> extends Result<V, Nothing> {
//   public constructor(private _value: V) {
//     super();
//   }

//   get value() {
//     return this._value;
//   }

//   takeOk(): V {
//     return this.value;
//   }

//   takeErr(): never {
//     throw Error("Trying to takeErr on a `Ok` Result");
//   }

//   isOk(): this is Ok<V> {
//     return true;
//   }

//   isErr(): this is Err<never> {
//     return false;
//   }
// }

// /**
//  * Represents a failed result, containing an error.
//  */
// export class Err<E> extends Result<Nothing, E> {
//   constructor(private _error: E) {
//     super();
//   }

//   get error() {
//     return this._error;
//   }

//   takeOk(): never {
//     throw Error("Trying to takeOk on an `Err` Result");
//   }

//   takeErr(): E {
//     return this.error;
//   }

//   isOk(): this is Ok<never> {
//     return false;
//   }

//   isErr(): this is Err<E> {
//     return true;
//   }
// }

// export namespace Result {
//   /**
//    * Represents a union type of Ok or Err, encapsulating a successful value or an error.
//    * @template V The type of the value for successful results.
//    * @template E The type of the error for failed results.
//    */
//   export type Union<V = void, E = void> = Ok<V> | Err<E>;

//   /** @internal */
//   type AnyResult = Result<any, any>;

//   /**
//    * Extracts the error type from a `Result` type.
//    * @template R The Result type to extract the error from. Must extend `Result`
//    */
//   export type ExtractErr<R extends AnyResult> = R extends Result<any, infer E>
//     ? E
//     : never;

//   /**
//    * Extracts the `Ok`'s value type from a `Result` type.
//    * @template R - The Result type to extract the value from. Must extends `Result`
//    */
//   export type ExtractOk<R extends AnyResult> = R extends Result<infer V, any>
//     ? V
//     : never;

//   export type Unfold<V, E> = V extends AnyResult
//     ? ExtractOk<V> extends AnyResult
//       ? Unfold<ExtractOk<V>, ExtractErr<ExtractOk<V>> | ExtractErr<V> | E>
//       : Result<ExtractOk<V>, ExtractErr<V> | E>
//     : Result<V, E>;

//   export type UnfoldRoot<R extends AnyResult> = R extends Err<infer E>
//     ? Err<E>
//     : R extends Ok<infer V>
//       ? Ok<V>
//       : R extends Result<infer V, infer E>
//         ? V extends AnyResult
//           ? ExtractOk<V> extends AnyResult
//             ? UnfoldRoot<
//                 Result<
//                   ExtractOk<V>,
//                   ExtractErr<ExtractOk<V>> | ExtractErr<V> | E
//                 >
//               >
//             : Result<ExtractOk<V>, ExtractErr<V> | E>
//           : Result<V, E>
//         : never;
// }

// type T1V = Result<number, "Error">;
// type T1I ult.UnfoldRoot<T1V>;
// type T1O = T1V;= Res

// type T1 = AssertEqual<T1I, T1O>;

// type T2V = Result<Result<number, "ErrorB">, "ErrorA">;
// type T2I = Result.UnfoldRoot<T2V>;
// type T2O = Result<number, "ErrorA" | "ErrorB">;

// type T2 = AssertEqual<T2I, T2O>;

// type T4V = Result<Result<Result<number, "ErrorC">, "ErrorB">, "ErrorA">;
// type T4I = Result.UnfoldRoot<T4V>;
// type T4O = Result<number, "ErrorA" | "ErrorB" | "ErrorC">;

// type T4 = AssertEqual<T4I, T4O>;

// type T5V = Result<
//   Result<
//     Result<Result<Result<number, "ErrorE">, "ErrorD">, "ErrorC">,
//     "ErrorB"
//   >,
//   "ErrorA"
// >;
// type T5I = Result.UnfoldRoot<T5V>;
// type T5O = Result<number, "ErrorA" | "ErrorB" | "ErrorC" | "ErrorD" | "ErrorE">;

// type T5 = AssertEqual<T5I, T5O>;

// type T6V = Err<number>;
// type T6I = Result.UnfoldRoot<T6V>;
// type T6O = T6V;
// type T6 = AssertEqual<T6I, T6O>;

// type T7V = Ok<boolean>;
// type T7I = Result.UnfoldRoot<T7V>;
// type T7O = T7V;
// type T7 = AssertEqual<T7I, T7O>;

// // T8: Single level Result (similar to T1 but renamed as T8)
// type T8I = Result.Unfold<number, "Error">;
// type T8O = Result<number, "Error">;
// type T8 = AssertEqual<T8I, T8O>;

// // T9: Two-level nested Result
// type T9I = Result.Unfold<Result<number, "ErrorB">, "ErrorA">;
// type T9O = Result<number, "ErrorA" | "ErrorB">;
// type T9 = AssertEqual<T9I, T9O>;

// // T10: Three-level nested Result
// type T10I = Result.Unfold<Result<Result<number, "ErrorC">, "ErrorB">, "ErrorA">;
// type T10O = Result<number, "ErrorA" | "ErrorB" | "ErrorC">;
// type T10 = AssertEqual<T10I, T10O>;

// // T11: Five-level nested Result
// type T11I = Result.Unfold<
//   Result<
//     Result<Result<Result<number, "ErrorE">, "ErrorD">, "ErrorC">,
//     "ErrorB"
//   >,
//   "ErrorA"
// >;
// type T11O = Result<
//   number,
//   "ErrorA" | "ErrorB" | "ErrorC" | "ErrorD" | "ErrorE"
// >;
// type T11 = AssertEqual<T11I, T11O>;

// // T12: Single level Err
// type T12I = Result.Unfold<Err<number>, never>;
// type T12O = Err<number>;
// type T12 = AssertEqual<T12I, T12O>;

// // T13: Single level Ok
// type T13I = Result.Unfold<Ok<boolean>, never>;
// type T13O = Ok<boolean>;
// type T13 = AssertEqual<T13I, T13O>;
