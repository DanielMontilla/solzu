import { Err, Ok, Result } from "../..";

type Empty = void;

/**
 * Represents a value of one of two possible types (a disjoint union).
 * Instances of `Either` are either an instance of `Left` or `Right`.
 * @template L - The type of the `Left` value.
 * @template R - The type of the `Right` value.
 */
export abstract class Either<L = Empty, R = Empty> {
  /**
   * Extracts the `Left` value directly.
   * @throws If `Either` is `Right`.
   * @returns The `Left` value.
   */
  abstract unwrapLeft(): L;

  /**
   * Extracts the `Right` value directly.
   * @throws If `Either` is `Left`.
   * @returns The `Right` value.
   */
  abstract unwrapRight(): R;

  /**
   * Checks if the `Either` is `Left`.
   * @returns `true` if `Either` is `Left`, otherwise `false`.
   */
  abstract isLeft(): this is Left<L>;

  /**
   * Checks if the `Either` is `Right`.
   * @returns `true` if `Either` is `Right`, otherwise `false`.
   */
  abstract isRight(): this is Right<R>;

  /**
   * Performs a side effect when `Either` is `Left`.
   * @param fn - The function to execute if `Either` is `Left`.
   * @returns The original `Either` for chaining.
   */
  abstract onLeft(fn: (lValue: L) => any): Either<L, R>;

  /**
   * Performs a side effect when `Either` is `Right`.
   * @param fn - The function to execute if `Either` is `Right`.
   * @returns The original `Either` for chaining.
   */
  abstract onRight(fn: (rValue: R) => any): Either<L, R>;

  /**
   * Swaps the sides of the `Either`, turning a `Left` into a `Right` and vice versa.
   * @returns {Either<R, L>} A new `Either` instance with the sides swapped.
   */
  abstract swap(): Either<R, L>;

  /**
   * Converts `Either` to `Result` type.
   * When `Left`, becomes `Ok<L>`, otherwise if `Right<R>`; becomes `Err<R>`.
   * @returns A `Result` representation of the `Either`.
   */
  abstract toResult(): Result<L, R>;

  /**
   * Creates a `Left` instance of `Either`.
   * @template V - The type of the `Left` value.
   * @param value - The value to wrap in `Left`.
   * @returns A `Left` instance containing the value.
   */
  public static Left<V>(value: V): Left<V>;
  public static Left(value: void): Left<Empty>;
  public static Left<V>(value: V): Left<V> {
    return new Left(value);
  }

  /**
   * Creates a `Right` instance of `Either`.
   * @template E - The type of the `Right` value.
   * @param value - The value to wrap in `Right`.
   * @returns A `Right` instance containing the value.
   */
  public static Right<E>(value: E): Right<E>;
  public static Right(value: void): Right<Empty>;
  public static Right<E>(value: E): Right<E> {
    return new Right(value);
  }
}

/**
 * Represents the `Left` side of an `Either` that typically encapsulates a failure or an error.
 * @template L - The type of the `Left` value.
 */
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
    throw Error("Trying to unwrapRight a `Left` instance");
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

  public toResult(): Ok<L> {
    return Result.Ok(this.value);
  }

  swap(): Right<L> {
    return Either.Right(this.value);
  }
}

/**
 * Represents the `Right` side of an `Either` that typically encapsulates a success or a return value.
 * @template R - The type of the `Right` value.
 */
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

  public toResult(): Err<R> {
    return Result.Err(this.value);
  }

  swap(): Left<R> {
    return Either.Left(this.value);
  }
}
