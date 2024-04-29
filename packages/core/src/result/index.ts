import { Nothing, Operator } from "..";

export type Ok<V> = { kind: "ok"; value: V };
export type Err<E> = { kind: "err"; error: E };
export type Result<V = Nothing, E = Nothing> = Ok<V> | Err<E>;

export namespace Result {
  export type Any = Result<any, any>;
  export type OkOf<R extends Any> = R extends Ok<infer V> ? V : never;
  export type ErrOf<R extends Any> = R extends Err<infer E> ? E : never;
}

/**
 * @description shorthand for promise of result
 * @template V inner `Ok` type. Defaults to `Nothing`
 * @template E inner `Err` type. Defaults to `Nothing`
 * @returns {Promise<Result<V, E>>}
 */
export type Task<V = Nothing, E = Nothing> = Promise<Result<V, E>>;

export type OkOf<R extends Result.Any> = Result.OkOf<R>;
export type ErrOf<R extends Result.Any> = Result.ErrOf<R>;

export function Ok(): Ok<Nothing>;
export function Ok<V>(value: V): Ok<V>;
export function Ok<V>(value?: V): Ok<V> | Ok<Nothing> {
  return value !== undefined ?
      {
        kind: "ok",
        value,
      }
    : { kind: "ok", value: Nothing() };
}

export function Err<E = Nothing>(): Err<E | Nothing>;
export function Err<E>(error: E): Err<E>;
export function Err<E>(error?: E): Err<E> | Err<E | Nothing> {
  return error !== undefined ?
      { kind: "err", error }
    : { kind: "err", error: Nothing() };
}

export function isOk<V>(result: Result<V, any>): result is Ok<V> {
  return result.kind === "ok";
}

export const notErr = isOk;

export function isErr<E>(result: Result<any, E>): result is Err<E> {
  return result.kind === "err";
}

export const notOk = isErr;

export function onOk<V>(
  f: (ok: V) => any
): Operator<Result<V, any>, Result<V, any>> {
  return (result: Result<V, any>): Result<V, any> => {
    if (isOk(result)) f(result.value);
    return result;
  };
}

export function onErr<E>(
  f: (err: E) => any
): Operator<Result<any, E>, Result<any, E>> {
  return result => {
    if (isErr(result)) f(result.error);
    return result;
  };
}
