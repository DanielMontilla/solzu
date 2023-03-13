declare type ErrStatus = string;

/** @description wrapper for successfull result value */
declare type Ok<V> = {
  status: 'ok',
  value: V
}

/** @description wrapper for failed result, contains error(s) that caused failure */
declare type Err<E extends ErrStatus | ErrStatus[]> = {
  status: 'err',
  error: E
}

/**
 * @template V value type of result
 * @template E error(s) type(s) for failed result
*/
declare type Result<
  V,
  E extends ErrStatus | ErrStatus[] = ErrStatus
> = Ok<V> | Err<E>;

declare type EmptyResult<E extends ErrStatus = ErrStatus> = Result<undefined, E>;

declare type MultiErrResult<
  V,
  E extends ErrStatus = ErrStatus
> = Result<V, E[]>;

declare type EmptyMultiErrResult<
  E extends ErrStatus = ErrStatus
> = MultiErrResult<undefined, E>

declare interface CheckBranches<V, E extends ErrStatus | ErrStatus[]> {
  ok: (value: V) => void,
  err: (error: E) => void,
}

declare function ok<V>(value: V): Ok<V>;
declare function ok(): Ok<undefined>;
declare function err<E extends ErrStatus>(error: E): Err<E>;
declare function errs<E extends ErrStatus>(errors: E[]): Err<E[]>

declare function isOk<T, E extends ErrStatus = ErrStatus>(
  result: Result<T, E>
): result is Ok<T>;

declare function isErr<T, E extends ErrStatus = ErrStatus>(
  result: Result<T, E>
): result is Err<E>;

declare function check<V, E extends ErrStatus | ErrStatus[]>(
  result: Result<V, E>,
  branches?: Partial<CheckBranches<V, E>>
): void;
