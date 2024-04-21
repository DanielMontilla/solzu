import { Nothing, Procedure } from "..";

export type Ok<V> = { kind: "ok"; value: V };
export type Err<E> = { kind: "err"; error: E };
export type Result<V = Nothing, E = Nothing> = Ok<V> | Err<E>;

export namespace Result {
  export type Any = Result<any, any>;
  export type OkOf<R extends Any> = R extends Ok<infer V> ? V : never;
  export type ErrOf<R extends Any> = R extends Err<infer E> ? E : never;
}

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

export function isOk<R extends Result.Any>(result: R): result is OkOf<R> {
  return result.kind === "ok";
}

export function isErr<R extends Result.Any>(result: R): result is ErrOf<R> {
  return result.kind === "err";
}

export function onOk<R extends Result.Any>(
  f: (ok: OkOf<R>) => any
): Procedure<R, R> {
  return (result: R): R => {
    if (isOk(result)) f(result.value);
    return result;
  };
}
