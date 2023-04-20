export type Ok<V = void> = {
  _type: 'ok',
  value: V
  unwrap(): V
}

export type Err<E = string> = {
  _type: 'err',
  error: E
  unwrap(): never;
}

export type Result<V, E> = Ok<V> | Err<E>;

export function ok<V>(value: V): Ok<V>;
export function ok<V = void>(value: void): Ok<void>;
export function ok<V>(value: V): Ok<V> {
  return {
    _type: 'ok',
    value,
    unwrap() {
      return unwrap(this);
    }
  }
}

export function err<E>(error: E): Err<E>;
export function err<E = void>(error: void): Err<void>;
export function err<E>(error: E): Err<E> {
  return {
    _type: 'err',
    error,
    unwrap() {
      return unwrap(this);
    }
  }
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result._type === 'ok';
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result._type === 'err';
}

export function match<V, E>(
  result: Result<V, E>,
  branches: {
    ok?: (value: V) => void;
    err?: (error: E) => void;
  }
) {
  if ((isOk(result) && branches.ok)) branches.ok(result.value);
  if (isErr(result) && branches.err) branches.err(result.error);
}

/**
 * Unwraps the value from a Result object and throws an error if the Result object is an Err object.
 *
 * @template V
 * @template E
 * @param {Result<V, E>} result - The Result object to unwrap.
 * @returns {V} - The unwrapped value from the Result object.
 * @throws {Error} - Throws an error if the Result object is an Err object.
 * 
 * @author Daniel Montilla
 */
export function unwrap<V, E>(result: Result<V, E>): V {;
  if (isErr(result)) throw new Error(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
  return result.value;
}