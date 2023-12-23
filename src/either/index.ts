type Empty = void;

export abstract class Either<L = Empty, R = Empty> {
  /** Extracts `Ok` value directly @throws if `this` is `Err` */
  abstract unwrapLeft(): L;

  /** Extracts `Err` error directly @throws if `this` is `Ok` */
  abstract unwrapRight(): R;

  /** @returns {boolean} `true` if instance is `Ok` otherwise `false` */
  abstract isLeft(): this is Left<L>;

  /** @returns {boolean} `true` if instance is `Err` otherwise `false` */
  abstract isRight(): this is Right<R>;

  /** Performs side effect when instance is `Ok` */
  abstract doLeft(fn: (lValue: L) => any): Either<L, R>;

  /** Performs side effect when instance is `Err` */
  abstract doRight(fn: (rValue: R) => any): Either<L, R>;

  public static Left<V>(value: V): Left<V>;
  public static Left(value: void): Left<Empty>;
  public static Left<V>(value: V): Left<V> {
    return new Left(value);
  }

  public static Right<E>(value: E): Right<E>;
  public static Right(value: void): Right<Empty>;
  public static Right<E>(value: E): Right<E> {
    return new Right(value);
  }

}

export class Left<L> extends Either<L, never> {
  public constructor(
    private _value: L
  ) { super() }

  public get value() { return this._value }
  public unwrapLeft(): L { return this.value }
  public unwrapRight(): never { throw Error('Trying to unwrapErr a `Ok` instance') }
  public isLeft(): this is Left<L> { return true }
  public isRight(): this is Right<never> { return false }
  public doLeft(fn: (value: L) => any): Either<L, never> {
    fn(this.value);
    return this;
  }
  public doRight(_: (errors: never) => any): Either<L, never> { return this }
}

export class Right<R> implements Either<never, R> {

  public constructor(
    private _value: R
  ) { }

  public get error() { return this._value }
  public unwrapLeft(): never { throw Error('Trying to unwrapOk a `Err` instance') }
  public unwrapRight(): R { return this.error }
  public isLeft(): this is Left<never> { return false }
  public isRight(): this is Right<R> { return true }
  public doLeft(_: (value: never) => any): Either<never, R> { return this }
  public doRight(fn: (errors: R) => any): Either<never, R> {
    fn(this.error);
    return this;
  }
}