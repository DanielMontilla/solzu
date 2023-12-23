import { Err, Result, Ok } from "../result";

export abstract class Option<V> {
  /** Extracts value directly @throws if `Option` is `None` */
  abstract unwrap(): V;

  /** @returns {boolean} `true` if `Option` is `Some` otherwise `false` */
  abstract isSome(): this is Some<V>;

  /** @returns {boolean} `true` if `Option` is `None` otherwise `false` */
  abstract isNone(): this is None;

  /** Performs side effect when `Option` is `Some` */
  abstract onSome(fn: (value: V) => any): Option<V>;

  /** Performs side effect when `Option` is `None` */
  abstract onNone(fn: () => any): Option<V>;

  /** If `Option` is `Some` performs callback and sets value to `Some(value)`, otherwise remains `None` */
  abstract mapSome<To>(fn: (value: V) => To): Option<To>;

  abstract toResult(error: void): Result<V, void>;
  abstract toResult<E>(error: E): Result<V, E>;

  public static Some<V>(value: V): Some<V> {
    return new Some(value);
  }

  public static None(): None {
    return new None();
  }

  public static Pure<V>(value?: V): Option<V> {
    if (value !== undefined) return new Some(value);
    return new None();
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
  constructor(
    protected readonly _value: V,
  ) { super() }

  get value() { return this._value }
  isSome(): this is Some<V> { return true }
  isNone(): this is None { return false }

  unwrap(): V { return this.value }
  onNone(_: () => any): Option<V> { return this }
  onSome(fn: (some: V) => any): Option<V> {
    fn(this.value);
    return this;
  }

  mapSome<To>(fn: (value: V) => To): Option<To> {
    return new Some(fn(this.value));
  }

  toResult(error: void): Ok<V>;
  toResult<E>(_error?: E): Ok<V> {
    return Result.Ok(this.value);
  }
}

export class None extends Option<never> {
  constructor() { super(); }
  unwrap(): never { throw Error('Trying to unwrap a `None` value') }
  isSome(): this is Some<never> { return false }
  isNone(): this is None { return true }
  onSome(_: (some: never) => any): Option<never> { return this }
  onNone(fn: () => any): Option<never> {
    fn();
    return this;
  }
  mapSome<To>(_fn: (value: never) => To): Option<To> {
    return new None();
  }

  toResult(error: void): Err<void>;
  toResult<E>(error: E): Err<E> {
    return Result.Err(error);
  }
}