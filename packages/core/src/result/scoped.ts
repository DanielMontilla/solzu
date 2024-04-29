import { isOk, Result, Ok, Err } from ".";
import { Operator } from "../types";
import { isFunction } from "../utility";

export function FromCallback<V, E>(
  fn: () => V,
  mapper: (error: unknown) => E
): Result<V, E>;

export function FromCallback<V>(fn: () => V): Result<V, unknown>;
export function FromCallback<V, E>(
  fn: () => V,
  mapper?: (error: unknown) => E
): Result<V, unknown> | Result<V, E> {
  try {
    return Ok(fn());
  } catch (e) {
    return mapper ? Err(mapper(e)) : Err(e);
  }
}

export const map =
  <V, E, Output>(
    f: (okValue: V) => Output
  ): Operator<Result<V, E>, Result<Output, E>> =>
  (result: Result<V, E>): Result<Output, E> =>
    isOk(result) ? Ok(f(result.value)) : result;

export function or<V, E>(f: () => V): Operator<Result<V, E>, V>;
export function or<V, E>(value: V): Operator<Result<V, E>, V>;
export function or<V, E>(fOrValue: (() => V) | V): Operator<Result<V, E>, V> {
  return (result: Result<V, E>): V =>
    isOk(result) ? result.value
    : isFunction(fOrValue) ? fOrValue()
    : fOrValue;
}
