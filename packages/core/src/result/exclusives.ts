import { ErrOf, isOk, OkOf, Result, Ok, Err } from ".";
import { Procedure } from "../types";

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
  <R extends Result.Any, Output>(
    f: (okValue: OkOf<R>) => Output
  ): Procedure<R, Result<Output, ErrOf<R>>> =>
  (result: R): Result<Output, ErrOf<R>> =>
    isOk(result) ? Ok(f(result.value)) : result;
