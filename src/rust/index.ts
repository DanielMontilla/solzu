import './definitions';
import { defineGlobals } from "../helper";

defineGlobals([
  {
    key: 'ok',
    value: <V>(value: V): Ok<V> => ({ status: 'ok', value }),
  },
  {
    key: 'err',
    value: <E extends ErrStatus = ErrStatus>(error: E): Err<E> => ({ status: 'err', error }),
  },
  {
    key: 'errs',
    value: <E extends ErrStatus>(errors: E[]): Err<E[]> => ({ status: 'err', error: errors }),
  },
  {
    key: 'isOk',
    value: <T, E extends ErrStatus = ErrStatus>(
      result: Result<T, E>
    ): result is Ok<T> => result.status === 'ok',
  },
  {
    key: 'isErr',
    value: <T, E extends ErrStatus = ErrStatus>(
      result: Result<T, E>
    ): result is Err<E> => result.status === 'err',
  },
  {
    key: 'check',
    value: <V, E extends ErrStatus | ErrStatus[]>(
      result: Result<V, E>,
      branches?: Partial<CheckBranches<V, E>>
    ): void => {
      const { ok: okFn, err: errFn } = defineOptions(branches, {
        ok: NOOP,
        err: NOOP,
      });
      switch (result.status) {
        case "ok":
          okFn(result.value);
          break;
        case "err":
          errFn(result.error);
          break;
      }
    }
  }
]);