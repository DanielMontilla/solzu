import { NOOF } from ".";

type Empty = void;

export type Result<V = Empty, E = Empty> = Ok<V> | Err<E>;

type Kind = 'ok' | 'err';
type ResultValue<K extends Kind, T> = K extends 'ok' ? T : never;
type ResultError<K extends Kind, T> = K extends 'err' ? T : never;

export interface IResult<K extends Kind, T> {
  unwrap(): ResultValue<K, T>;
  isOk(): this is Ok<T>;
  isErr(): this is Err<T>;
  onOk(fn: (value: ResultValue<K, T>) => any): Result<ResultValue<K, T>, ResultError<K, T>>;
  onErr(fn: (errors: ResultError<K, T>) => any): Result<ResultValue<K, T>, ResultError<K, T>>;
  match(matches: ResultMatch<ResultValue<K, T>, ResultError<K, T>>): Result<ResultValue<K, T>, ResultError<K, T>>;
}

export class Ok<V> implements IResult<'ok', V> {
  public constructor(
    private _value: V
  ) { }
  public get value() { return this._value }
  public unwrap(): V { return this.value }
  public isOk(): this is Ok<V> { return true }
  public isErr(): this is Err<V> { return false }
  public onErr(_: (errors: never) => any): Result<V, never> { return this }
  public onOk(fn: (value: V) => any): Result<V, never> {
    fn(this.value);
    return this;
  }
  match(matches: ResultMatch<V, never>): Result<V, never> {
   return this.onOk(matches.ok ?? NOOF); 
  }
}

export class Err<E> implements IResult<'err', E> {

  public constructor(
    private _error: E
  ) { }

  public get error() { return this._error }
  public unwrap(): never { throw new Error(typeof this.error === 'string' ? this.error : JSON.stringify(this.error)) }
  public isOk(): this is Ok<E> { return false }
  public isErr(): this is Err<E> { return true }
  public onOk(_: (value: never) => any): Result<never, E> { return this }
  public onErr(fn: (errors: E) => any): Result<never, E> {
    fn(this.error);
    return this;
  }
  public match(matches: ResultMatch<never, E>): Result<never, E> {
    return this.onErr(matches.err ?? NOOF);
  }
}

export function ok<V>(value: V): Ok<V>;
export function ok(value: void): Ok<Empty>;
export function ok<V>(value: V): Ok<V> {
  return new Ok(value);
}

export function err<E>(error: E): Err<E>;
export function err<E>(error: void): Err<Empty>;
export function err<E>(error: E): Err<E> {
  return new Err(error);
}

export function isOk<V, E>(result: Result<V, E>): result is Ok<V> {
  return result.isOk();
}

export function isErr<V, E>(result: Result<V, E>): result is Err<E> {
  return result.isErr();
}

export type ResultMatch<V, E> = {
  ok?: (value: V) => void;
  err?: (error: E) => void;
}

export function resultMatch<V, E>(result: Result<V, E>, matches: ResultMatch<V, E>) {
  return result.match(matches);
}

// Some typescript wizardry to have both a `Result` type and kinda static class
export namespace Result {
  export function Ok<V>(value: V): _Ok<V>;
  export function Ok(value: void): _Ok<Empty>;
  export function Ok<V>(value: V): _Ok<V> {
    return new _OkAlias(value);
  }

  export function Err<E>(error: E): _Err<E>;
  export function Err(error: void): _Err<Empty>;
  export function Err<E>(error: E): _Err<E> {
    return new _ErrAlias(error);
  }

  export function isOk<V, E>(result: Result<V, E>): result is Ok<V> {
    return result.isOk();
  }
  
  export function isErr<V, E>(result: Result<V, E>): result is Err<E> {
    return result.isErr();
  }

  export function unwrap<V, E>(result: Result<V, E>): V {
    return result.unwrap();
  }

  export function match<V, E>(result: Result<V, E>, matches: ResultMatch<V, E>) {
    return result.match(matches);
  }
}

type _Ok<V> = Ok<V>;
type _Err<E> = Err<E>;

const _OkAlias = Ok;
const _ErrAlias = Err;