import { Either } from "..";

type Empty = void;

export abstract class Result<V = Empty, E = Empty> {
  /** Extracts `Ok` value directly @throws if `Result` is `Err` */
  abstract takeOk(): V;

  /** Extracts `Err` error directly @throws if `Result` is `Ok` */
  abstract takeErr(): E;

  /** @returns {boolean} `true` if `Result` is `Ok` otherwise `false` */
  abstract isOk(): this is Ok<V>;

  /** @returns {boolean} `true` if `Result` is `Err` otherwise `false` */
  abstract isErr(): this is Err<E>;

  /** Performs side effect when `Result` is `Ok` */
  abstract doOk(fn: (value: V) => any): Result<V, E>;

  /** Performs side effect when `Result` is `Err` */
  abstract doErr(fn: (error: E) => any): Result<V, E>;

  abstract toEither(): Either<V, E>;

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

  public static PureOk(value: void): Result<Empty, unknown>;
  public static PureOk<V, E = unknown>(value: V): Result<V, E> {
    return new Ok(value);
  }

  public static PureErr(error: void): Result<unknown, Empty>;
  public static PureErr<E>(error: E): Result<unknown, E> {
    return new Err(error);
  }

  public static async FromPromise<V>(promise: Promise<V>): Promise<Result<V, unknown>> {
    try {
      return new Ok(await promise);
    } catch (e) {
      return new Err(e);
    }
  }

  public static FromTryCatch<V>(fn: () => V): Result<V, unknown> {
    try {
      return Result.Ok(fn());
    } catch (e) {
      return Result.Err(e);
    }
  }
}

export class Ok<V> extends Result<V, never> {
  public constructor(private _value: V) {
    super();
  }

  public get value() {
    return this._value;
  }
  public takeOk(): V {
    return this.value;
  }
  public takeErr(): never {
    throw Error("Trying to unwrapErr a `Ok` instance");
  }
  public isOk(): this is Ok<V> {
    return true;
  }
  public isErr(): this is Err<never> {
    return false;
  }
  public doErr(_: (errors: never) => any): Result<V, never> {
    return this;
  }
  public doOk(fn: (value: V) => any): Result<V, never> {
    fn(this.value);
    return this;
  }

  public toEither(): Either<V, never> {
    return Either.Left(this.value);
  }
}

export class Err<E> extends Result<never, E> {
  public constructor(private _error: E) {
    super();
  }

  public get error() {
    return this._error;
  }
  public takeOk(): never {
    throw Error("Trying to unwrapOk a `Err` instance");
  }
  public takeErr(): E {
    return this.error;
  }
  public isOk(): this is Ok<never> {
    return false;
  }
  public isErr(): this is Err<E> {
    return true;
  }
  public doOk(_: (value: never) => any): Result<never, E> {
    return this;
  }
  public doErr(fn: (errors: E) => any): Result<never, E> {
    fn(this.error);
    return this;
  }

  public toEither(): Either<never, E> {
    return Either.Right(this._error);
  }
}
