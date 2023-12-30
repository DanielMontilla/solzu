import {
  Either,
  Mapper,
  None,
  Option,
  Predicate_ as Predicate,
  Guard,
  Some,
  Left,
  Right,
  EMPTY,
  Empty,
} from "../..";

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
   * @param effect - The function to execute if `Result` is `Ok`.
   * @returns The original `Result` for chaining.
   */
  abstract onOk(effect: (value: V) => any): Result<V, E>;

  /**
   * Performs a side effect when `Result` is `Err`.
   * @param effect - The function to execute if `Result` is `Err`.
   * @returns The original `Result` for chaining.
   */
  abstract onErr(effect: (error: E) => any): Result<V, E>;

  /**
   * Transforms the `Ok` value of the `Result` using a given mapper function.
   * @template To The type of the resulting `Ok` value after applying the mapper.
   * @param mapper A function that takes the `Ok` value and returns a new value.
   * @returns A `Result` with the transformed `Ok` value or the original `Err`.
   */
  abstract mapOk<To = V>(mapper: Mapper<V, To>): Result<To, E>;

  /**
   * Transforms the `Err` value of the `Result` using a given mapper function.
   * @template To The type of the resulting `Err` value after applying the mapper.
   * @param mapper A function that takes the `Err` value and returns a new value.
   * @returns A `Result` with the original `Ok` or the transformed `Err` value.
   */
  abstract mapErr<To = E>(mapper: Mapper<E, To>): Result<V, To>;

  /**
   * Checks if the `Ok` value satisfies a predicate and returns the original `Result` if true.
   * Otherwise returns an `Err` with an internal type of the existing error o an Empty value.
   * @param predicate A function that evaluates the `Ok` value if called on `Ok` instance.
   * @returns The original `Result` if `Ok` value satisfies the predicate or an `Err` with an empty error.
   */
  public checkOk(predicate: Predicate<V>): Result<V, E | Empty>;

  /**
   * Checks if the `Ok` value satisfies a predicate and returns the original `Result` if true.
   * Otherwise returns an `Err` with an internal type of the existing error o the specified error.
   * @template Ex The type of the additional error.
   * @param predicate A function that evaluates the `Ok` value.
   * @param error The error to use in the resulting `Err` if the predicate fails.
   * @returns The original `Result` if `Ok` value satisfies the predicate or an `Err` with the provided error.
   */
  public checkOk<Ex>(predicate: Predicate<V>, error: Ex): Result<V, E | Ex>;

  /**
   * @internal
   * Checks if the `Ok` value satisfies a predicate and returns the original `Result` or an `Err` with an optional error.
   * @template Ex The type of the additional error, defaulting to `E`.
   * @param predicate A function that evaluates the `Ok` value.
   * @param error Optional error to use in the resulting `Err` if the predicate fails.
   * @returns The original `Result` if `Ok` value satisfies the predicate or an `Err` with the optional error.
   */
  public checkOk<Ex = E>(
    predicate: Predicate<V>,
    error?: Ex
  ): Result<V, E> | Result<V, E | Ex> | Result<V, E | Empty> {
    if (this.isErr()) return this;
    if (predicate(this.takeOk())) return this;
    return error !== undefined
      ? Result.Err<E | Ex>(error)
      : Result.Err<E | Empty>();
  }

  /**
   * Asserts the `Ok` value of the `Result` matches a type guard and returns a new `Result` with the asserted type.
   * @template To The type to assert the `Ok` value to.
   * @param guard A type guard function to assert the `Ok` value.
   * @returns A `Result<To, E | Empty>` with the asserted `Ok` value or the original `Err`.
   */
  public assertOk<To>(guard: Guard<To>): Result<To, E | Empty>;

  /**
   * Asserts the `Ok` value of the `Result` matches a type guard and returns a new `Result` with the asserted type or a provided error.
   * @template To The type to assert the `Ok` value to.
   * @template Ex The type of the additional error.
   * @param guard A type guard function to assert the `Ok` value.
   * @param error The error to use in the resulting `Err` if the assertion fails.
   * @returns A `Result<To, E | Ex>` with the asserted `Ok` value or the provided error.
   */
  public assertOk<To, Ex = E>(guard: Guard<To>, error: Ex): Result<To, E | Ex>;

  /**
   * @internal
   * Asserts the `Ok` value of the `Result` matches a type guard and returns a new `Result` with the asserted type or an optional error.
   * @template To The type to assert the `Ok` value to.
   * @template Ex The type of the additional error, defaulting to `E`.
   * @param guard A type guard function to assert the `Ok` value.
   * @param error Optional error to use in the resulting `Err` if the assertion fails.
   * @returns A `Result<To, E>` or `Result<V, E | Ex>` or `Result<V, E | Empty>` with the asserted `Ok` value or error.
   */
  public assertOk<To, Ex = E>(
    guard: Guard<To>,
    error?: Ex
  ): Result<To, E> | Result<V, E | Ex> | Result<V, E | Empty> {
    if (this.isErr()) return this;
    if (guard(this.takeOk())) return this as unknown as Result<To, E>;
    return error !== undefined
      ? Result.Err<E | Ex>(error)
      : Result.Err<E | Empty>();
  }

  public unfold(): Result.Unfold<V, E> {
    const self = this.toUnion();

    // @ts-expect-error
    if (self.isErr()) return this;

    // @ts-expect-error
    if (!(self.value instanceof Result)) return this;

    // @ts-expect-error
    return self.value;
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

  public toUnion(): Result.Union<V, E> {
    if (this instanceof Ok || this instanceof Err) return this;
    throw Error(
      "trying to convert to union a object thats not Ok or Err instance"
    );
  }

  /**
   * Creates a new `Ok` result with an empty value.
   * @returns An `Ok` result containing an empty value.
   */
  public static Ok(): Ok<Empty>;

  /**
   * Creates a new `Ok` result with a value.
   * @template V The type of the value.
   * @param value The value to store in the `Ok` result.
   * @returns An `Ok` result containing the value.
   */
  public static Ok<V>(value: V): Ok<V>;

  /**
   * @internal
   * Creates a new `Ok` result, which may contain a value or be empty.
   * @template V The type of the value.
   * @param value The value to store in the `Ok` result, if provided.
   * @returns An `Ok` result containing the value or an empty `Ok` result.
   */
  public static Ok<V>(value?: V): Ok<V> | Ok<Empty> {
    return value !== undefined ? new Ok<V>(value) : new Ok<Empty>(EMPTY);
  }

  /**
   * Creates a new `Err` result that may contain an error or be empty. Specify a type to create an `Err<E | Empty>`.
   * @see {@link Result.Err<E>(error: E): Err<E>} To create a specific `Err<E>` without the `Empty`
   * @template E The type of the error.
   * @returns An `Err<E | Empty>` result that may contain an error or be empty.
   */
  public static Err<E = Empty>(): Err<E | Empty>;

  /**
   * Creates a new `Err` result containing the provided error.
   * @template E The type of the error.
   * @param error The error to store in the `Err` result.
   * @returns An `Err` result containing the error.
   */
  public static Err<E>(error: E): Err<E>;

  /**
   * @internal
   * Creates a new `Err` result, which may contain an error or be empty.
   * @template E The type of the error.
   * @param error The error to store in the `Err` result, if provided.
   * @returns An `Err` result containing the error or an empty `Err` result.
   */
  public static Err<E>(error?: E): Err<E> | Err<E | Empty> {
    return error !== undefined ? new Err<E>(error) : new Err<E | Empty>(EMPTY);
  }

  /**
   * Creates a new `Result` with both `Ok` and `Err` as empty. Internally an `Ok<Empty>` is created.
   * @returns A `Result<Empty, Empty>`.
   */
  public static Of(): Result<Empty, Empty>;

  /**
   * Creates a new `Result<V, E>`. Internally a `Err<E | Empty>`.
   * @see {@link Result.Of<V, E>(kind: "err", error: E): Result<V, E>} To create a specific `Err<E>` without the `Empty`
   * @template V The type of the value.
   * @template E The type of the error.
   * @returns A `Result<Empty, E | Empty>`.
   */
  public static Of<V = Empty, E = Empty>(kind: "err"): Result<V, E | Empty>;

  /**
   * Creates a new `Result`. Internally a `Ok<Empty>`.
   * @see {@link Result.Of<V, E>(kind: "ok", value: V): Result<V, E>} To create a non `Empty` `Ok`.
   * @template E The type of the error.
   * @returns A `Result<Empty, E | Empty>`.
   */
  public static Of<E = Empty>(kind: "ok"): Result<Empty, E | Empty>;

  /**
   * Creates a new `Result<V, E>`. Internally a `Ok<V>`.
   * @template V The type of the value.
   * @template E The type of the error.
   * @param value The value for the `Ok` result.
   * @returns A `Result<V, E>`.
   */
  public static Of<V = Empty, E = Empty>(kind: "ok", value: V): Result<V, E>;

  /**
   * Creates a new `Result<V, E>`. Internally a `Err<E>`.
   * @template V The type of the value.
   * @template E The type of the error.
   * @param error The error for the `Err` result.
   * @returns A `Result<V, E>`.
   */
  public static Of<V = Empty, E = Empty>(kind: "err", error: E): Result<V, E>;

  /**
   * @internal
   * General method for creating a new `Result<V, E>`.
   * @template V The type of the value.
   * @template E The type of the error.
   * @param kind Specifies the kind of result to create ("ok" or "err").
   * @param content The content of the `Ok` (value) or `Err` (error), depending on `kind`.
   * @returns A `Result` which can be various combinations of `V` and `E`.
   */
  public static Of<V = Empty, E = Empty>(
    kind?: "ok" | "err",
    content?: V | E
  ): Result<Empty, Empty> | Result<V, E | Empty> | Result<V, E> {
    return kind === undefined
      ? Result.Ok()
      : kind === "ok"
        ? content !== undefined
          ? Result.Ok(content as V)
          : Result.Ok()
        : content !== undefined
          ? Result.Err<E>(content as E)
          : Result.Err<E>();
  }

  /**
   * Converts a promise or a promise-returning function into a `Promise<Result<V, unknown>>`.
   * @template V The type of resolved value of the promise.
   * @param promise A promise or a function that returns a promise to convert.
   * @returns A promise that resolves to a `Result` of the value or unknown error.
   */
  public static async FromPromise<V>(
    promise: Promise<V> | (() => Promise<V>)
  ): Promise<Result<V, unknown>>;

  /**
   * Converts a promise or a promise-returning function into a `Promise<Result<V, E>>`, mapping the error using a provided function.
   * @template V The type of resolved value of the promise.
   * @template E The type of the error after being mapped.
   * @param promise A promise or a function that returns a promise to convert.
   * @param mapper A function to map the caught error to type `E`.
   * @returns A promise that resolves to a `Result` of the value or mapped error.
   */
  public static async FromPromise<V, E>(
    promise: Promise<V> | (() => Promise<V>),
    mapper: Mapper<unknown, E>
  ): Promise<Result<V, E>>;

  /**
   * @internal
   * Converts a promise or a promise-returning function into a `Promise<Result<V, E | unknown>>`, optionally mapping the error.
   * @template V The type of resolved value of the promise.
   * @template E The type of the error after being mapped, if a mapper is provided.
   * @param promise A promise or a function that returns a promise to convert.
   * @param mapper Optional function to map the caught error to type `E`.
   * @returns A promise that resolves to a `Result` of the value or error.
   */
  public static async FromPromise<V, E>(
    promise: Promise<V> | (() => Promise<V>),
    mapper?: Mapper<unknown, E>
  ): Promise<Result<V, E> | Result<V, unknown>> {
    try {
      return typeof promise === "function"
        ? Result.Ok(await promise())
        : Result.Ok(await promise);
    } catch (e) {
      return mapper ? Result.Err(mapper(e)) : Result.Err(e);
    }
  }

  /**
   * Attempts to execute a function and captures the result or error in a `Result`, with error mapping.
   * @template V The type of the value returned by the function.
   * @template E The type of the error after being mapped.
   * @param fn The function to execute.
   * @param mapper A function to map the caught error to type `E`.
   * @returns A `Result<V, E>` capturing the function's return value or mapped error.
   */
  public static FromTryCatch<V, E>(
    fn: () => V,
    mapper: Mapper<unknown, E>
  ): Result<V, E>;

  /**
   * Attempts to execute a function and captures the result or error in a `Result`.
   * @template V The type of the value returned by the function.
   * @param fn The function to execute.
   * @returns A `Result<V, unknown>` capturing the function's return value or error.
   */
  public static FromTryCatch<V>(fn: () => V): Result<V, unknown>;

  /**
   * @internal
   * Attempts to execute a function and captures the result or error in a `Result`, optionally with error mapping.
   * @template V The type of the value returned by the function.
   * @template E The type of the error after being mapped, if a mapper is provided.
   * @param fn The function to execute.
   * @param mapper Optional function to map the caught error to type `E`.
   * @returns A `Result<V, unknown>` or `Result<V, E>` capturing the function's return value or error.
   */
  public static FromTryCatch<V, E>(
    fn: () => V,
    mapper?: Mapper<unknown, E>
  ): Result<V, unknown> | Result<V, E> {
    try {
      return Result.Ok(fn());
    } catch (e) {
      return mapper ? Result.Err(mapper(e)) : Result.Err(e);
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

  onErr(_: (errors: never) => any): Ok<V> {
    return this;
  }

  onOk(fn: (value: V) => any): Ok<V> {
    fn(this.value);
    return this;
  }

  mapOk<To = V>(mapper: Mapper<V, To>): Ok<To> {
    return Result.Ok(mapper(this.value));
  }

  mapErr<To>(_mapper: Mapper<any, To>): Ok<V> {
    return this;
  }

  toEither(): Left<V> {
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

  onOk(_: (value: never) => any): Err<E> {
    return this;
  }

  onErr(fn: (errors: E) => any): Err<E> {
    fn(this.error);
    return this;
  }

  mapOk<To>(_mapper: Mapper<any, To>): Err<E> {
    return this;
  }

  mapErr<To = E>(mapper: Mapper<E, To>): Err<To> {
    return Result.Err(mapper(this.error));
  }

  public toEither(): Right<E> {
    return Either.Right(this._error);
  }

  toOption(): None {
    return Option.None();
  }
}

export namespace Result {
  /**
   * Represents a union type of Ok or Err, encapsulating a successful value or an error.
   * @template V The type of the value for successful results.
   * @template E The type of the error for failed results.
   */
  export type Union<V = void, E = void> = Ok<V> | Err<E>;

  /** @internal */
  type AnyResult = Result<any, any>;

  /**
   * Extracts the error type from a `Result` type.
   * @template R The Result type to extract the error from. Must extend `Result`
   */
  export type ExtractErr<R extends AnyResult> = R extends Result<any, infer E>
    ? E
    : never;

  /**
   * Extracts the `Ok`'s value type from a `Result` type.
   * @template R - The Result type to extract the value from. Must extends `Result`
   */
  export type ExtractOk<R extends AnyResult> = R extends Result<infer V, any>
    ? V
    : never;

  export type Unfold<V, E> = V extends Result<infer U, infer F>
    ? Result<U, E | F>
    : Result<V, E>;

  export type Flatten<V, E> = V extends Result<infer U, infer F>
    ? F extends E
      ? Result<U, E>
      : never
    : Result<V, E>;
}
