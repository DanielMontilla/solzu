import {
  type Predicate,
  type Mapper,
  isFunction,
  Result,
  Ok,
  Err,
  Never,
} from "../..";

export abstract class Maybe<V> {
  abstract take(): V;

  abstract isSome(): this is Some<V>;

  abstract isNone(): this is None;

  abstract takeWith(error: void): V;

  abstract takeWith<E>(error: E): V;

  abstract takeOr<Or>(fnOrValue: (() => Or) | Or): Or | V;

  abstract onSome(fn: (value: V) => any): Maybe<V>;
  abstract onNone(fn: () => any): Maybe<V>;

  abstract map<To>(mapper: Mapper<V, To>): Maybe<To>;

  abstract check(predicate: Predicate<V>): Maybe<V>;

  abstract toUnion(): Maybe.Union<V>;

  abstract toResult<E>(error: E): Result<V, E>;
  abstract toResult(): Result<V>;

  abstract toBase(): Maybe<V>;

  public static Some<V>(value: V): Some<V> {
    return new Some(value);
  }

  private static none: None | undefined;
  public static None(): None {
    return Maybe.none ?? (Maybe.none = new None());
  }

  public static FromNullish<V>(value: V): Maybe<Exclude<V, null | undefined>> {
    if (value === null || value === undefined) return new None();
    return new Some(value as Exclude<V, null | undefined>);
  }

  public static async FromPromise<V>(promise: Promise<V>): Promise<Maybe<V>> {
    try {
      return new Some(await promise);
    } catch (_) {
      return new None();
    }
  }

  public static FromTryCatch<V>(callback: () => V): Maybe<V> {
    try {
      return new Some(callback());
    } catch (_) {
      return new None();
    }
  }
}

export class Some<V> extends Maybe<V> {
  public get value() {
    return this._value;
  }

  constructor(private readonly _value: V) {
    super();
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
  takeWith(_error: unknown): V {
    return this.value;
  }

  takeOr<Or>(_fnOrValue: Or | (() => Or)): V | Or {
    return this.value;
  }

  onSome(fn: (value: V) => any): Some<V> {
    fn(this.value);
    return this;
  }

  onNone(_fn: () => any): Some<V> {
    return this;
  }

  map<To>(mapper: Mapper<V, To>): Some<To> {
    return Maybe.Some(mapper(this.value));
  }

  check(predicate: Predicate<V>): Maybe<V> {
    if (predicate(this.value)) return this;
    return Maybe.None();
  }

  toUnion(): Maybe.Union<V> {
    return this;
  }

  toBase(): Maybe<V> {
    return this;
  }

  toResult<E>(error: E): Ok<V>;
  toResult(): Ok<V>;
  toResult<E>(_error?: E): Ok<V> {
    return Result.Ok(this.value);
  }
}

export class None extends Maybe<Never> {
  constructor() {
    super();
  }

  isSome(): this is Some<never> {
    return false;
  }

  isNone(): this is None {
    return true;
  }

  take(): Never {
    throw Maybe.ERROR.take;
  }

  takeWith(error: void): never;
  takeWith<E>(error: E): never;
  takeWith(error: unknown): never {
    throw error;
  }

  takeOr<Or>(fnOrValue: Or | (() => Or)): Or {
    return isFunction(fnOrValue) ? fnOrValue() : fnOrValue;
  }

  onSome(_fn: (value: Never) => any): None {
    return this;
  }

  onNone(fn: () => any): None {
    fn();
    return this;
  }

  map<To>(_mapper: Mapper<Never, To>): None {
    return this;
  }

  check(_predicate: Predicate<Never>): None {
    return this;
  }

  toUnion(): Maybe.Union<Never> {
    return this;
  }

  toBase(): Maybe<Never> {
    return this;
  }

  toResult<E>(error: E): Err<E>;
  toResult(): Err<void>;
  toResult<E>(error?: E): Err<E> | Err<void> {
    if (error !== undefined) return Result.Err(error);
    return Result.Err<void>();
  }

  /**
   *
   * @todo stuff
   */
  populate<V>(): Maybe<V> {
    return this;
  }
}

export namespace Maybe {
  export type Union<V> = Some<V> | None;

  export type Extract<O extends Maybe<any>> = O extends Maybe<infer U>
    ? U
    : never;

  export const ERROR = {
    take: new Error("Trying to take value from `None` instance"),
  } as const;
}
