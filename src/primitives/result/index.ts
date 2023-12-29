import {
  Either,
  Mapper,
  None,
  Option,
  Predicate_ as Predicate,
  Guard,
  Some,
} from "../..";

type Empty = void;

/**
 * Represents a value that might be a successful result (`Ok`) or an error (`Err`).
 * It's a way to handle errors or success without throwing exceptions.
 * @template V - The type of the value for successful results.
 * @template E - The type of the error for failed results.
 */
export abstract class Result<V = Empty, E = Empty> {
  /**
   * Extracts the `Ok` value directly.
   * @throws If the `Result` is `Err`.
   * @returns The `Ok` value.
   */
  abstract takeOk(): V;

  /**
   * Extracts the `Err` value directly.
   * @throws If the `Result` is `Ok`.
   * @returns The `Err` value.
   */
  abstract takeErr(): E;

  /**
   * Checks if the `Result` is `Ok`.
   * @returns `true` if `Result` is `Ok`, otherwise `false`.
   */
  abstract isOk(): this is Ok<V>;

  /**
   * Checks if the `Result` is `Err`.
   * @returns `true` if `Result` is `Err`, otherwise `false`.
   */
  abstract isErr(): this is Err<E>;

  /**
   * Performs a side effect when `Result` is `Ok`.
   * @param fn - The function to execute if `Result` is `Ok`.
   * @returns The original `Result` for chaining.
   */
  abstract onOk(fn: (value: V) => any): Result<V, E>;

  /**
   * Performs a side effect when `Result` is `Err`.
   * @param fn - The function to execute if `Result` is `Err`.
   * @returns The original `Result` for chaining.
   */
  abstract onErr(fn: (error: E) => any): Result<V, E>;

  /**
   * Applies a mapper function to the `Ok` value of the `Result`.
   * Returns a new `Result` with the transformed `Ok` value or the original `Err`.
   *
   * @template To - The type of the resulting `Ok` value.
   * @param {Mapper<V, To>} mapper - Function to transform the `Ok` value.
   * @returns {Result<To, E>} - Transformed `Result` or original `Err`.
   */
  abstract mapOk<To = V>(mapper: Mapper<V, To>): Result<To, E>;

  /**
   * Applies a mapper function to the `Err` value of the `Result`.
   * Returns a new `Result` with the transformed `Err` value or the original `Ok`.
   *
   * @template To - The type of the resulting `Err` value.
   * @param {Mapper<E, To>} mapper - Function to transform the `Err` value.
   * @returns {Result<V, To>} - Original `Ok` or transformed `Err`.
   */
  abstract mapErr<To = E>(mapper: Mapper<E, To>): Result<V, To>;

  /**
   * Checks the `Ok` value of the `Result` against a predicate and potentially changes the error type.
   * If the `Result` is `Ok` and the predicate is true, returns the `Result` unchanged.
   * If the predicate is false, returns a new `Err` with the provided error or a default error.
   * If the `Result` is already `Err`, returns it unchanged.
   *
   * @template Ex - The type of the new error if the predicate fails.
   * @param {Predicate<V>} predicate - Function to test the `Ok` value.
   * @param {Ex} [error] - Optional new error to use if the predicate fails.
   * @returns {Result<V, Ex | E>} - Unchanged `Result` or new `Err` with the specified or default error.
   */
  public checkOk(predicate: Predicate<V>): Result<V, E | void>;
  public checkOk<Ex = E>(predicate: Predicate<V>, error: Ex): Result<V, Ex | E>;
  public checkOk<Ex = E>(
    predicate: Predicate<V>,
    error?: Ex
  ): Result<V, E | Ex> | Result<V, E | void> {
    if (this.isErr()) return this;
    if (predicate(this.takeOk())) return this;
    return error !== undefined ? Result.Err(error) : Result.Err();
  }

  /**
   * Asserts that the `Ok` value of the `Result` satisfies the provided guard function.
   * If the assertion fails, it returns an `Err` with the provided error or a default error.
   * If the `Result` is already `Err`, it will just pass through.
   *
   * @template To - The type the guard function asserts to.
   * @template Ex - The type of the error to be returned if the assertion fails.
   */

  /**
   * @overload
   * Asserts the `Ok` value using a guard function without providing a custom error.
   * If the guard function returns false, it returns a default `Err`.
   * @param {Guard<To>} guard - A guard function that asserts the type of the `Ok` value.
   * @returns {Result<To, E>} - The original `Result` if the assertion passes, or a default `Err`.
   */
  public assertOk<To>(guard: Guard<To>): Result<To, E>;

  /**
   * @overload
   * Asserts the `Ok` value using a guard function and provides a custom error for assertion failure.
   * @param {Guard<To>} guard - A guard function that asserts the type of the `Ok` value.
   * @param {Ex} error - The error to return if the assertion fails.
   * @returns {Result<To, E | Ex>} - The original `Result` if the assertion passes, or an `Err` with the provided error.
   */
  public assertOk<To, Ex = E>(guard: Guard<To>, error: Ex): Result<To, E | Ex>;

  public assertOk<To, Ex = E>(
    guard: Guard<To>,
    error?: Ex
  ): Result<To, E> | Result<V, E | Ex> | Result<V, void> {
    if (this.isErr()) return this;
    if (guard(this.takeOk())) return this as unknown as Result<To, E>;
    return error !== undefined ? Result.Err(error) : Result.Err();
  }

  /**
   * Converts `Result` to `Either` type.
   * @returns An `Either` representation of the `Result`.
   */
  abstract toEither(): Either<V, E>;

  /**
   * Converts `Result` to `Option` type.
   * When `Err` becomes `None`, otherwise if `Ok<V>`; becomes `Some<V>`.
   * @returns An `Option`.
   */
  abstract toOption(): Option<V>;

  /**
   * Creates an `Ok` result.
   * @template V - The type of the value.
   * @param {V | void} value - The value to wrap in an `Ok` result.
   * @returns {Ok<V>} An `Ok` result containing the value.
   */
  public static Ok<V>(value: V): Ok<V>;
  public static Ok(value: void): Ok<Empty>;
  public static Ok<V>(value: V): Ok<V> {
    return new Ok(value);
  }

  /**
   * Creates an `Err` result.
   * @template E - The type of the error.
   * @param {E | void} error - The error to wrap in an `Err` result.
   * @returns {Err<E>} An `Err` result containing the error.
   */
  public static Err<E>(error: E): Err<E>;
  public static Err(error: void): Err<Empty>;
  public static Err<E>(error: E): Err<E> {
    return new Err(error);
  }

  /**
   * Factory method to create a `Result` instance. It can create an `Ok` or `Err` result,
   * or default to an `Ok` result with no content if no parameters are provided.
   *
   * @template V - The type of the value for `Ok`.
   * @template E - The type of the error for `Err`.
   * @param {"ok" | "err"} [kind] - Specifies whether to create an `Ok` or `Err` result.
   * @param {V | E} [content] - The content for the `Ok` value or `Err` error.
   * @returns {Result<V, E>} - A new `Result` instance, either `Ok` or `Err`.
   *
   * @example
   * Result.Of(); // Defaults to Ok<void>
   * // ^? Result<void, void>
   *
   * @example
   * Result.Of("ok", "Success!");
   * // ^? Result<string, void>;
   *
   * Result.Of<string, CustomError>("ok", "Success!");
   * // ^? Result<string, CustomError>;
   *
   * @example
   * Result.Of("err", "Error occurred");
   * // ^? Result<void, string>;
   *
   * Result.Of<number, string>("err", "Error occurred");
   * // ^? Result<number, string>;
   */
  public static Of(): Result;
  public static Of<V = void, E = void>(kind: "ok", content: V): Result<V, E>;
  public static Of(kind: "ok"): Result;
  public static Of<V = void, E = void>(kind: "err", content: E): Result<V, E>;
  public static Of(kind: "err"): Result;
  public static Of<V = void, E = void>(
    kind?: "ok" | "err",
    content?: V | E
  ): Result<V, E> {
    return (
      kind === undefined
        ? Result.Ok()
        : kind === "ok"
          ? content !== undefined
            ? Result.Ok(content)
            : Result.Ok()
          : content !== undefined
            ? Result.Err(content)
            : Result.Err()
    ) as Result<V, E>;
  }

  /**
   * Converts a promise into a `Result`, capturing resolution or rejection.
   * Optionally transforms rejection errors using a provided mapper.
   * Always resolves!
   *
   * @template V - The type of the resolved value.
   * @template E - The type of the transformed error.
   * @param {Promise<V>} promise - The promise to convert.
   * @param {Mapper<unknown, E>} [mapper] - Function to transform caught errors.
   * @returns {Promise<Result<V, E>> | Promise<Result<V, unknown>>} - A promise resolving to `Ok` with the value or `Err` with the error.
   * @example
   * const fetchData: Promise<Data>;
   * const mapError: (error: unknown) => CustomError;
   *
   * const result = await Result.FromPromise(fetchData);
   * // ^? Result<Data, unknown>
   * const result = await Result.FromPromise(fetchData, mapError);
   * // ^? Result<Data, CustomError>
   */
  public static async FromPromise<V>(
    promise: Promise<V>
  ): Promise<Result<V, unknown>>;
  public static async FromPromise<V, E>(
    promise: Promise<V>,
    mapper: Mapper<unknown, E>
  ): Promise<Result<V, E>>;
  public static async FromPromise<V, E>(
    promise: Promise<V>,
    mapper?: Mapper<unknown, E>
  ): Promise<Result<V, E> | Result<V, unknown>> {
    try {
      return new Ok(await promise);
    } catch (e) {
      const error = mapper ? mapper(e) : e;
      return new Err(error);
    }
  }

  /**
   * Executes a function and captures the result or error in a `Result`.
   * Optionally transforms caught errors using a provided mapper.
   *
   * @template V - The type of the returned value.
   * @template E - The type of the transformed error.
   * @param {() => V} fn - The function to execute.
   * @param {Mapper<unknown, E>} [mapper] - Function to transform caught errors.
   * @returns {Result<V, E> | Result<V, unknown>} - `Ok` with the value or `Err` with the error.
   * @example
   * const riskyOperation: () => number;
   * const mapError: (error: unknown) => CustomError;
   *
   * const result = Result.FromTryCatch(() => riskyOperation());
   * // ^? Result<number, unknown>
   *
   * const result = Result.FromTryCatch(() => riskyOperation(), mapError);
   * // ^? Result<number, CustomError>
   */
  public static FromTryCatch<V, E>(
    fn: () => V,
    mapper: Mapper<unknown, E>
  ): Result<V, E>;
  public static FromTryCatch<V>(fn: () => V): Result<V, unknown>;
  public static FromTryCatch<V, E>(
    fn: () => V,
    mapper?: Mapper<unknown, E>
  ): Result<V, unknown> | Result<V, E> {
    try {
      return Result.Ok(fn());
    } catch (e) {
      return new Err(mapper ? mapper(e) : e);
    }
  }
}

/**
 * Represents a successful result, containing a value.
 */
export class Ok<V> extends Result<V, never> {
  public constructor(private _value: V) {
    super();
  }

  get value() {
    return this._value;
  }

  takeOk(): V {
    return this.value;
  }

  takeErr(): never {
    throw Error("Trying to takeErr on a `Ok` Result");
  }

  isOk(): this is Ok<V> {
    return true;
  }

  isErr(): this is Err<never> {
    return false;
  }

  onErr(_: (errors: never) => any): Result<V, never> {
    return this;
  }

  onOk(fn: (value: V) => any): Result<V, never> {
    fn(this.value);
    return this;
  }

  mapOk<To = V>(mapper: Mapper<V, To>): Ok<To> {
    return Result.Ok(mapper(this.value));
  }

  mapErr<To>(_mapper: Mapper<any, To>): Ok<V> {
    return this;
  }

  toEither(): Either<V, never> {
    return Either.Left(this.value);
  }

  toOption(): Some<V> {
    return Option.Some(this.value);
  }
}

/**
 * Represents a failed result, containing an error.
 */
export class Err<E> extends Result<never, E> {
  constructor(private _error: E) {
    super();
  }

  get error() {
    return this._error;
  }

  takeOk(): never {
    throw Error("Trying to takeOk on an `Err` Result");
  }

  takeErr(): E {
    return this.error;
  }

  isOk(): this is Ok<never> {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }

  onOk(_: (value: never) => any): Result<never, E> {
    return this;
  }

  onErr(fn: (errors: E) => any): Result<never, E> {
    fn(this.error);
    return this;
  }

  mapOk<To>(_mapper: Mapper<any, To>): Err<E> {
    return this;
  }

  mapErr<To = E>(mapper: Mapper<E, To>): Err<To> {
    return Result.Err(mapper(this.error));
  }

  public toEither(): Either<never, E> {
    return Either.Right(this._error);
  }

  toOption(): None {
    return Option.None();
  }
}

export namespace Result {
  export const AssertOk = <V, E>(_result: Result<V, E>): _result is Ok<V> =>
    true;
  export const AssertErr = <V, E>(_result: Result<V, E>): _result is Err<E> =>
    true;
}
