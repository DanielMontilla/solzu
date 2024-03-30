import type { Effect, Mapper, Proc, Predicate } from "../types";

/**
 * @todo docs
 * @todo type testing
 */
export type Some<V> = {
  readonly kind: "some";
  readonly value: V;
} & Maybe.Methods<V>;

/**
 * @todo docs
 * @todo type tests
 */
export type None = { readonly kind: "none" } & Maybe.Methods<never>;

/**
 * @todo docs
 * @todo type tests
 */
export type Maybe<V> = Some<V> | None;

export namespace Maybe {
  /**
   * @todo docs
   * @todo type tests
   */
  export interface Methods<V> {
    take(): V;
    toMaybe(): Maybe<V>;
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param value
   * @returns
   */
  export function Some<V>(value: V): Some<V> {
    return {
      kind: "some",
      value,
      take() {
        return this.value;
      },
      toMaybe() {
        return this as Maybe<V>;
      },
    };
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   */
  export const None: None = {
    kind: "none",
    take() {
      throw new Error("");
    },
    toMaybe() {
      return this as Maybe<never>;
    },
  };

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param maybe
   * @returns
   */
  export function isSome<V>(maybe: Maybe<V>): maybe is Some<V> {
    return maybe.kind === "some";
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param maybe
   * @returns
   */
  export function isNone<V>(maybe: Maybe<V>): maybe is None {
    return maybe.kind === "none";
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param value
   * @returns
   */
  export function FromNullish<V>(
    value: V
  ): Maybe<Exclude<V, null | undefined>> {
    if (value === null || value === undefined) return None;
    return Some(value as Exclude<V, null | undefined>);
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param promise
   * @returns
   */
  export async function FromPromise<V>(promise: Promise<V>): Promise<Maybe<V>> {
    try {
      return Some(await promise);
    } catch (_) {
      return None;
    }
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param callback
   * @returns
   */
  export function FromTryCatch<V>(callback: () => V): Maybe<V> {
    try {
      return Some(callback());
    } catch (_) {
      return None;
    }
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param mapper
   * @returns
   */
  export function map<M extends Maybe.Any, To>(
    mapper: Mapper<SomeOf<M>, To>
  ): Proc<M, Maybe<To>> {
    return (maybe: M) => {
      if (isNone(maybe)) return None;
      return Some(mapper(maybe.value));
    };
  }

  export function or<M extends Maybe.Any>(other: M): Proc<M, M> {
    return (maybe: M) => {
      if (isSome(maybe)) return maybe;
      return other;
    };
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param effect
   * @returns
   */
  export function onSome<M extends Maybe.Any>(
    effect: Effect<SomeOf<M>>
  ): Proc<M> {
    return (maybe: M) => {
      if (isSome(maybe)) effect(maybe.value);
      return maybe;
    };
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param effect
   * @returns
   */
  export function onNone<M extends Maybe.Any>(effect: Effect): Proc<M> {
    return (maybe: M) => {
      if (isNone(maybe)) effect();
      return maybe;
    };
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param predicate
   * @returns
   */
  export function check<M extends Maybe.Any>(
    predicate: Predicate<SomeOf<M>>
  ): Proc<M> {
    return (maybe: M) => {
      if (isSome(maybe) && predicate(maybe.value)) return maybe;
      return None as M;
    };
  }

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param value
   */
  export function takeOr<M extends Maybe.Any, Value>(
    value: Value
  ): Proc<M, Value>;

  /**
   * @todo docs
   * @todo runtime tests
   * @todo type tests
   * @param fn
   */
  export function takeOr<M extends Maybe.Any, Value>(
    fn: () => Value
  ): Proc<M, Value>;

  export function takeOr<M extends Maybe.Any, Value>(
    fnOrValue: Value | (() => Value)
  ): Proc<M, Value> {
    return (maybe: M) => {
      if (isNone(maybe))
        return typeof fnOrValue !== "function"
          ? fnOrValue
          : (fnOrValue as () => Value)();
      return maybe.value;
    };
  }

  /**
   * @todo docs
   * @todo type tests
   */
  export type Any = Maybe<any>;

  /**
   * @todo docs
   * @todo type tests
   */
  export type Unknown = Maybe<unknown>;

  /**
   * @todo docs
   * @todo type tests
   */
  export type SomeOf<T extends Maybe<any>> =
    T extends Some<infer U> ? U : T extends Maybe<infer F> ? F : never;
}

/**
 * @todo docs
 */
export const Some = Maybe.Some;

/**
 * @todo docs
 */
export const None = Maybe.None;
