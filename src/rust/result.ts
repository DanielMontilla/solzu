export type Ok<V = void> = {
  _type: 'ok',
  value: V
}

export type Err<E = string> = {
  _type: 'err',
  error: E
}

export type Result<V, E> = Ok<V> | Err<E>;

export function ok<V>(value: V): Ok<V>;
export function ok<V = void>(value: void): Ok<void>;
export function ok<V>(value: V): Ok<V> {
  return {
    _type: 'ok',
    value
  }
}

export function err<E>(error: E): Err<E>;
export function err<E = void>(error: void): Err<void>;
export function err<E>(error: E): Err<E> {
  return {
    _type: 'err',
    error
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