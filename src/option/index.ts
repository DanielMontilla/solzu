import { isFunction } from "../function";
import { Err, Result, Ok } from "../result";
import type { Predicate, Mapper } from "../types/index";

export abstract class Option<V> {
  /**
   * Extracts the value from the `Option`.
   * @returns The value `V` if the `Option` is `Some(V)`.
   * @throws Throws an error if the `Option` is `None`.
   */
  abstract take(): V;

  /**
   * Extracts the value from the Option, throwing a custom error if the Option is None.
   * @param error - The custom error or message to throw if the Option is None. If not provided, a default error is thrown.
   * @returns The value V if the Option is Some(V).
   * @throws Throws the provided error or a default error if the Option is None.
   * @template E The type of the custom error.
   */
  abstract takeWith(error: void): V;
  abstract takeWith<E>(error: E): V;

  /** @returns {boolean} `true` if `Option` is `Some` otherwise `false` */
  abstract isSome(): this is Some<V>;

  /** @returns {boolean} `true` if `Option` is `None` otherwise `false` */
  abstract isNone(): this is None;

  /** Performs side effect when `Option` is `Some` */
  abstract onSome(fn: (value: V) => any): Option<V>;

  /** Performs side effect when `Option` is `None` */
  abstract onNone(fn: () => any): Option<V>;

  /** If `Option` is `Some` performs callback and sets return value as `Some(value)`. If `None` then it remains `None` */
  abstract mapSome<To = V>(mapper: Mapper<V, To>): Option<To>;

  /** If `Option` is `None` performs callback and sets return to `Some(value)`. If `Option` is `Some` becomes `None` */
  abstract mapNone<To = V>(mapper: Mapper<never, To>): Option<To>;

  /**
   * Flattens nested `Option` types into a single `Option`.
   * @returns A flattened `Option`, removing one level of nesting in the `Option` structure.
   */
  abstract flatten(): Option.Flatten<V>;

  /**
   * Checks the `Option` with a predicate and turns it into `None` if the predicate is not satisfied.
   * @param predicate - A function that evaluates to `true` or `false` given the `Option`'s value.
   * @returns The original `Option` if the predicate is `true`, otherwise `None`.
   * @template To The type parameter for the predicate function.
   */
  abstract check<To = V>(predicate: Predicate<V, To>): Option<To>;

  /**
   * Returns the `Option`'s value if it's `Some`, otherwise returns the provided default value or the result of an invokable function.
   * @param fnOrValue - The default value or function to invoke for a default value if the `Option` is `None`.
   * @returns The value of the `Option` if it's `Some`, otherwise the default value or the result of the function.
   * @template T The type of the default value or the return type of the function.
   */
  abstract takeOr<T = V>(fnOrValue: (() => T) | T): T | V;

  /**
   * Converts the `Option` to a `Result` type, useful for error handling.
   * @param error - The error value to use in the `Result` if the `Option` is `None`.
   * @returns A `Result` containing the value if the `Option` is `Some`, otherwise an error.
   * @template E The type of the error.
   */
  abstract toResult<E>(error: E): Result<V, E>;

  /**
   * Creates a new `Some` instance with the provided value.
   * @param value - The value to be contained in the `Some`.
   * @returns A new `Some` instance containing the value.
   * @template V The type of the value.
   */
  public static Some<V>(value: V): Some<V> {
    return new Some(value);
  }

  /**
   * Creates a new `None` instance.
   * @returns A new `None` instance.
   */
  public static None(): None {
    return new None();
  }

  /**
   * Creates a new `Option` from a value, returning `None` for null or undefined, otherwise `Some`.
   * @param value - The value to create an `Option` from.
   * @returns A new `Option` instance, `None` if the value was null or undefined, otherwise `Some`.
   * @template V The type of the value.
   */
  public static Of<V>(value?: V): Option<V> {
    if (value === null || value === undefined) return new None();
    return new Some(value);
  }

  /**
   * Creates an `Option` from a potentially nullable value, excluding null and undefined from the type.
   * @param value - The potentially nullable value.
   * @returns A new `Option` instance, `None` if the value was null or undefined, otherwise `Some`.
   * @template V The type of the value.
   */
  public static FromNullable<V>(
    value: V
  ): Option<Exclude<V, null | undefined>> {
    if (value === null || value === undefined) return new None();
    return new Some(value as Exclude<V, null | undefined>);
  }

  /**
   * Creates an `Option` from a `Promise`, resolving to `Some` with the value if the promise fulfills, or `None` if it rejects.
   * @param promise - The promise to create an `Option` from.
   * @returns A `Promise` resolving to an `Option` of the value type.
   * @template V The type of the value that the promise resolves to.
   */
  public static async FromPromise<V>(promise: Promise<V>): Promise<Option<V>> {
    try {
      return new Some(await promise);
    } catch (_) {
      return new None();
    }
  }

  /**
   * Creates an `Option` from a function that might throw, capturing the exception as `None` and the return value as `Some`.
   * @param callback - The function to execute.
   * @returns An `Option` of the return type of the function, `None` if the function throws.
   * @template V The return type of the function.
   */
  public static FromTryCatch<V>(callback: () => V): Option<V> {
    try {
      return new Some(callback());
    } catch (_) {
      return new None();
    }
  }
}

export class Some<V> extends Option<V> {
  constructor(protected readonly _value: V) {
    super();
  }

  get value() {
    return this._value;
  }

  isSome(): this is Some<V> {
    return true;
  }

  isNone(): this is None {
    return false;
  }

  take(): V {
    return this.value;
  }

  takeWith(error: void): V;
  takeWith<E>(error: E): V;
  takeWith<E>(_error: E): V {
    return this.value;
  }

  onNone(_: () => any): Option<V> {
    return this;
  }

  onSome(fn: (some: V) => any): Option<V> {
    fn(this.value);
    return this;
  }

  mapSome<To>(mapper: Mapper<V, To>): Option<To> {
    return new Some(mapper(this.value));
  }

  mapNone<To>(_mapper: Mapper<never, To>): Option<To> {
    return new None();
  }

  check<To = V>(predicate: Predicate<V, To>): Option<To> {
    return predicate(this.value) ? (this as unknown as Option<To>) : new None();
  }

  takeOr<T>(_fnOrValue: T | (() => T)): V {
    return this.value;
  }

  flatten(): Option.Flatten<V> {
    return this.value instanceof Option
      ? (this.value.flatten() as Option.Flatten<V>)
      : (this as unknown as Option.Flatten<V>);
  }

  toResult(error: void): Ok<V>;
  toResult<E>(error: E): Ok<V>;
  toResult<E>(_error: E | void): Ok<V> {
    return Result.Ok(this.value);
  }
}

export class None extends Option<never> {
  constructor() {
    super();
  }

  take(): never {
    throw Error("Trying to unwrap a `None` value");
  }

  takeWith(error: void): never;
  takeWith<E>(error: E): never;
  takeWith<E>(error: E): never {
    throw error instanceof Error ? error : new Error(String(error));
  }

  isSome(): this is Some<never> {
    return false;
  }

  isNone(): this is None {
    return true;
  }

  onSome(_: (some: never) => any): None {
    return this;
  }

  onNone(fn: () => any): None {
    fn();
    return this;
  }

  mapSome<To>(_mapper: Mapper<any, To>): None {
    return this;
  }

  mapNone<To>(mapper: Mapper<never, To>): Option<To> {
    return new Some(mapper());
  }

  check<To = never>(_predicate: Predicate<never, To>): None {
    return this;
  }

  takeOr<T>(fnOrValue: T | (() => T)): T {
    return isFunction(fnOrValue) ? fnOrValue() : fnOrValue;
  }

  flatten(): never {
    return this as never;
  }

  toResult(error: void): Err<void>;
  toResult<E>(error: E): Err<E>;
  toResult<E = void>(error: E): Err<void> | Err<E> {
    return Result.Err(error);
  }
}

export namespace Option {
  export type Extract<O extends Option<any>> = O extends Option<infer U>
    ? U
    : never;

  type AnyNone = None | Option<void>;
  export type Flatten<V> = V extends AnyNone
    ? None
    : V extends Option<infer U>
      ? Flatten<U>
      : Option<V>;
}

// TODO: move
// type NestedOption<T> = Option<Option<Option<Option<T>>>>;
// type NestedNone = Option<Option<Option<None>>>;

// type Test1 = Option.Flatten<NestedOption<number>>;
// type Test2 = Option.Flatten<NestedNone>;
// type Test4 = Option.Flatten<void>;
// type Test5 = Option.Flatten<None>;
