import { Maybe, None, Some, SomeOf, isMaybe, isNone, isSome } from ".";
import { Procedure } from "../types";

export function FromNullish<V>(value: V): Maybe<Exclude<V, null | undefined>> {
  if (value === null || value === undefined) return None();
  return Some(value as Exclude<V, null | undefined>);
}

export async function FromPromise<V>(promise: Promise<V>): Promise<Maybe<V>> {
  try {
    return Some(await promise);
  } catch (_) {
    return None();
  }
}

export function FromTryCatch<V>(callback: () => V): Maybe<V> {
  try {
    return Some(callback());
  } catch (_) {
    return None();
  }
}

export const map =
  <M extends Maybe.Any, Output = M>(
    f: (someValue: SomeOf<M>) => Output
  ): Procedure<M, Maybe<Output>> =>
  (maybe: M): Maybe<Output> =>
    isSome(maybe) ? Some(f(maybe.value)) : maybe;

export const or =
  <M extends Maybe.Any>(value: SomeOf<M>): Procedure<M, SomeOf<M>> =>
  (maybe: M): SomeOf<M> =>
    isSome(maybe) ? maybe.value : value;

const MAX_FLATTEN_LAYERS = 256;
export const flatten =
  <M extends Maybe.Any>(): Procedure<M, Maybe.Flatten<M>> =>
  (maybe: M): Maybe.Flatten<M> => {
    if (isNone(maybe)) return maybe as Maybe.Flatten<M>;

    let inner = maybe.value;

    for (let _ = 0; _ < MAX_FLATTEN_LAYERS; _++) {
      if (!isMaybe(inner)) break;
      if (isNone(inner)) return maybe as Maybe.Flatten<M>;
      inner = inner.value;
    }

    return Some(inner) as Maybe.Flatten<M>;
  };

export const flatmap =
  <M extends Maybe.Any, Output extends Maybe.Any = M>(
    f: (someValue: SomeOf<M>) => Output
  ): Procedure<M, Output> =>
  (maybe: M): Output =>
    isSome(maybe) ? f(maybe.value) : (None() as Output);
