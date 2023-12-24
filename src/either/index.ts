import { Option, Some } from "../option";

type Empty = void;

export abstract class Either<L = Empty, R = Empty> {
  abstract get value(): L | R;

  /** Extracts `Left` value directly @throws if `Either` is `Right` */
  abstract unwrapLeft(): L;

  /** Extracts `Right` value directly @throws if `Either` is `Left` */
  abstract unwrapRight(): R;

  /** @returns {boolean} `true` if `Either` is `Left` otherwise `false` */
  abstract isLeft(): this is Left<L>;

  /** @returns {boolean} `true` if `Either` is `Right` otherwise `false` */
  abstract isRight(): this is Right<R>;

  /** Performs side effect when `Either` is `Left` */
  abstract onLeft(fn: (lValue: L) => any): Either<L, R>;

  /** Performs side effect when `Either` is `Right` */
  abstract onRight(fn: (rValue: R) => any): Either<L, R>;

  /** TODO: missing tests */
  abstract toOption(): Option<L> | Option<R>;

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
  public constructor(private readonly _value: L) {
    super();
  }

  public get value(): L {
    return this._value;
  }

  public unwrapLeft(): L {
    return this.value;
  }

  public unwrapRight(): never {
    throw Error("Trying to unwrapErr a `Ok` instance");
  }

  public isLeft(): this is Left<L> {
    return true;
  }

  public isRight(): this is Right<never> {
    return false;
  }

  public onLeft(fn: (value: L) => any): Either<L, never> {
    fn(this.value);
    return this;
  }

  public onRight(_: (errors: never) => any): Either<L, never> {
    return this;
  }

  public toOption(): Some<L> {
    return Option.Some(this.value);
  }
}

export class Right<R> extends Either<never, R> {
  public constructor(private readonly _value: R) {
    super();
  }

  public get value(): R {
    return this._value;
  }

  public unwrapLeft(): never {
    throw Error("Trying to unwrapLeft a `Right`");
  }

  public unwrapRight(): R {
    return this.value;
  }

  public isLeft(): this is Left<never> {
    return false;
  }

  public isRight(): this is Right<R> {
    return true;
  }

  public onLeft(_: (value: never) => any): Either<never, R> {
    return this;
  }

  public onRight(fn: (errors: R) => any): Either<never, R> {
    fn(this.value);
    return this;
  }

  public toOption(): Some<R> {
    return Option.Some(this.value);
  }
}
