type Empty = void;

export abstract class Result<V = Empty, E = Empty> {
  /** Extracts `Ok` value directly @throws if `this` is `Err` */
  abstract unwrapOk(): V;

  /** Extracts `Err` error directly @throws if `this` is `Ok` */
  abstract unwrapErr(): E;

  /** @returns {boolean} `true` if instance is `Ok` otherwise `false` */
  abstract isOk(): this is Ok<V>;

  /** @returns {boolean} `true` if instance is `Err` otherwise `false` */
  abstract isErr(): this is Err<E>;

  /** Performs side effect when instance is `Ok` */
  abstract doOk(fn: (value: V) => any): Result<V, E>;

  /** Performs side effect when instance is `Err` */
  abstract doErr(fn: (error: E) => any): Result<V, E>;

  public static Ok<V>(value: V): Ok<V>;
  public static Ok(value: void): Ok<Empty>;
  public static Ok<V>(value: V): Ok<V> {
    return new Ok(value);
  }

  public static Err<E>(error: E): Err<E>;
  public static Err(error: void): Err<Empty>;
  public static Err<E>(error: E): Err<E> {
    return new Err(error);
  }

  public static async FromPromise<V, E = void>(promise: Promise<V>): Promise<Result<V, E>> {
    try {
      return new Ok(await promise);
    } catch (e) {
      return new Err<E>(e as E);
    }
  }
}

export class Ok<V> extends Result<V, never> {
  public constructor(
    private _value: V
  ) { super() }

  public get value() { return this._value }
  public unwrapOk(): V { return this.value }
  public unwrapErr(): never { throw Error('Trying to unwrapErr a `Ok` instance') }
  public isOk(): this is Ok<V> { return true }
  public isErr(): this is Err<never> { return false }
  public doErr(_: (errors: never) => any): Result<V, never> { return this }
  public doOk(fn: (value: V) => any): Result<V, never> {
    fn(this.value);
    return this;
  }
}

export class Err<E> implements Result<never, E> {

  public constructor(
    private _error: E
  ) { }

  public get error() { return this._error }
  public unwrapOk(): never { throw Error('Trying to unwrapOk a `Err` instance') }
  public unwrapErr(): E { return this.error }
  public isOk(): this is Ok<never> { return false }
  public isErr(): this is Err<E> { return true }
  public doOk(_: (value: never) => any): Result<never, E> { return this }
  public doErr(fn: (errors: E) => any): Result<never, E> {
    fn(this.error);
    return this;
  }
}