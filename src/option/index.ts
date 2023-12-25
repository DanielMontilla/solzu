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

  abstract flatten(): Option.Flatten<V>;

  /** If is `Some` and predicate is `true` remains as `Some(value)` otherwise becomes `None` */
  abstract check<To = V>(predicate: Predicate<V, To>): Option<To>;

  abstract takeOr<T = V>(fnOrValue: (() => T) | T): T | V;
  abstract toResult(error: void): Result<V, void>;
  abstract toResult<E>(error: E): Result<V, E>;

  public static Some<V>(value: V): Some<V> {
    return new Some(value);
  }

  public static None(): None {
    return new None();
  }

  public static Of<V>(value?: V): Option<V> {
    if (value === null || value === undefined) return new None();
    return new Some(value);
  }

  public static FromNullable<V>(
    value: V
  ): Option<Exclude<V, null | undefined>> {
    if (value === null || value === undefined) return new None();
    return new Some(value as Exclude<V, null | undefined>);
  }

  public static async FromPromise<V>(promise: Promise<V>): Promise<Option<V>> {
    try {
      return new Some(await promise);
    } catch (_) {
      return new None();
    }
  }

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
    if (this.value instanceof Option) {
      return this.value.flatten() as Option.Flatten<V>;
    }
    return this as unknown as Option.Flatten<V>;
  }

  toResult(error: void): Ok<V>;
  toResult<E>(_error?: E): Ok<V> {
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

  mapSome<To>(_mapper: Mapper<never, To>): None {
    return this;
  }

  mapNone<To>(mapper: Mapper<never, To>): Some<To> {
    return new Some(mapper());
  }

  check<To = never>(_predicate: Predicate<never, To>): None {
    return this;
  }

  takeOr<T>(fnOrValue: T | (() => T)): T {
    return isFunction(fnOrValue) ? fnOrValue() : fnOrValue;
  }

  // TODO: is there any way to change this to None?
  flatten(): never {
    return this as never;
  }

  toResult(error: void): Err<void>;
  toResult<E>(error: E): Err<E> {
    return Result.Err(error);
  }
}

export namespace Option {
  export type Extract<O extends Option<any>> = O extends Option<infer U>
    ? U
    : never;

  export type Flatten<V> = V extends Option<never>
    ? None
    : V extends None
      ? None
      : V extends Option<infer U>
        ? Flatten<U>
        : Option<V>;
}
export type NestedOptions<T> = Option<Option<Option<Option<T>>>>;

export type Test1 = Option.Flatten<NestedOptions<number>>;
export type Test2 = Option.Flatten<None>;
