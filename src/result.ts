import { NOOP, NEVER, None } from ".";

export abstract class Result<V = None, E = None> {
  protected abstract _value: V
  protected abstract _error: E

  public static Ok<V>(value: V): Ok<V>;
  public static Ok<V = None>(value: void): Ok<None>;
  public static Ok<V>(value: V) {
    return new Ok(value);
  }

  public static Err<E>(error: E): Err<E>;
  public static Err<E = None>(error: void): Err<None>;
  public static Err<E>(error: E) {
    return new Err(error);
  }

  public unwrap(): V {
    if (isErr(this)) {
      throw new Error(typeof this.error === 'string' ? this.error : JSON.stringify(this.error));
    }
    return this._value;
  }

  public onOk(callback: (value: V) => any) {
    if (this instanceof Ok) callback(this.value);
    return this;
  }

  public onErr(callback: (error: E) => any) {
    if (this instanceof Err) callback(this.error);
    return this;
  }

  public match({ ok, err }: {
    ok?: (value: V) => any,
    err?: (error: E) => any
  }) {
    return this
      .onOk(ok ?? NOOP)
      .onErr(err ?? NOOP);
  }
}

export class Ok<V = void> extends Result<V, never> {
  protected _error = NEVER;
  constructor(
    protected _value: V,
  ) { super() }

  get value() {
    return this._value;
  }
}

export class Err<E> extends Result<never, E> {
  protected _value = NEVER;
  constructor(
    protected _error: E,
  ) { super() }

  get error() {
    return this._error;
  }
}

export function ok<V>(value: V): Ok<V>;
export function ok<V = void>(value: void): Ok<void>;
export function ok<V>(value: V): Ok<V> {
  return new Ok(value);
}

export function err<E>(error: E): Err<E>;
export function err<E = void>(error: void): Err<void>;
export function err<E>(error: E): Err<E> {
  return new Err(error);
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result instanceof Ok;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result instanceof Err;
}

export type ResultMatch<V, E> = {
  ok?: (value: V) => void;
  err?: (error: E) => void;
}

export function resultMatch<V, E>(
  result: Result<V, E>,
  matches: ResultMatch<V, E>
) {
  if ((isOk(result) && matches.ok)) matches.ok(result.value);
  if (isErr(result) && matches.err) matches.err(result.error);
}