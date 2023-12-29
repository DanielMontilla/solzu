export type Predicate<In> = (value: In) => boolean;
export type PredicateGuard<In, Out extends In> = (value: In) => value is Out;

export namespace Result {
  export abstract class Class<V, E> {
    private get self() {
      return this as unknown as Result<V, E>;
    }

    abstract isOk(): this is Ok<V>;
    abstract isErr(): this is Err<E>;

    checkOk(predicate: Predicate<V>): Result<V, E>;
    checkOk<ExtraError>(
      predicate: Predicate<V>,
      error: ExtraError
    ): Result<V, E | ExtraError>;
    checkOk<ExtraError>(
      predicate: Predicate<V>,
      error?: ExtraError
    ): Result<V, E | ExtraError> {
      const { self } = this;
      if (self.isErr() || !predicate(self.value)) return self;
      return (error === undefined ? Result.Err() : Result.Err(error)) as Result<
        V,
        E | ExtraError
      >;
    }
  }

  type Empty = void;

  export function Ok<V>(value: V): Ok<V>;
  export function Ok(value: void): Ok<Empty>;
  export function Ok<V>(value: V): Ok<V> {
    return new _Ok(value);
  }

  export function Err<E>(error: E): Err<E>;
  export function Err(error: void): Err<Empty>;
  export function Err<E>(error: E): Err<E> {
    return new _Err(error);
  }

  export function Of<V = void, E = void>(kind: "ok", content: V): Result<V, E>;
  export function Of<E = void>(kind: "ok"): Result<void, E>;
  export function Of<E = void, V = void>(kind: "err", content: E): Result<V, E>;
  export function Of<V = void>(kind: "err"): Result<V, void>;
  export function Of<V = void, E = void>(
    kind: "ok" | "err",
    content?: V | E
  ): Result<V, E> {
    return (
      kind === "ok"
        ? content !== undefined
          ? Ok(content)
          : Ok()
        : content !== undefined
          ? Err(content)
          : Err()
    ) as Result<V, E>;
  }
}

export type Result<V = void, E = void> = Ok<V> | Err<E>;

export class Ok<V> extends Result.Class<V, never> {
  constructor(public readonly value: V) {
    super();
  }

  isOk(): this is Ok<V> {
    return true;
  }

  isErr(): this is Err<never> {
    return false;
  }
}

export class Err<E> extends Result.Class<never, E> {
  constructor(public readonly error: E) {
    super();
  }

  isOk(): this is Ok<never> {
    throw new Error("Method not implemented.");
  }

  isErr(): this is Err<E> {
    throw new Error("Method not implemented.");
  }
}

// Aliases
const _Ok = Ok;
const _Err = Err;

const err = Result.Of<number>("ok").checkOk(() => true);
