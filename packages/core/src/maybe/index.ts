import { Nothing } from "..";

export type Some<V> = { kind: "some"; value: V };
export type None = { kind: "none" };

export type Maybe<V> = Some<V> | None;

export namespace Maybe {
  export type Any = Maybe<any>;
  export type SomeOf<M extends Any> = M extends Some<infer V> ? V : never;
  export type Flatten<M extends Any> =
    M extends Maybe<infer O> ?
      O extends Any ?
        Flatten<O>
      : M
    : never;
}

export type SomeOf<M extends Maybe.Any> = Maybe.SomeOf<M>;

export function Some(): Some<Nothing>;
export function Some<V>(value: V): Some<V>;
export function Some<V>(value?: V): Some<V> | Some<Nothing> {
  return value !== undefined ?
      {
        kind: "some",
        value,
      }
    : { kind: "some", value: Nothing() };
}

let _none: undefined | None;
export function None(): None {
  return _none !== undefined ? _none : (_none = { kind: "none" });
}

export function Maybe<V>(): Maybe<V>;
export function Maybe<V>(value: V): Maybe<V>;
export function Maybe<V>(value?: V): Maybe<V> {
  return value === undefined ? None() : Some(value);
}

export function isSome<M extends Maybe.Any>(maybe: M): maybe is SomeOf<M> {
  return maybe.kind === "some";
}

export function isNone<V>(maybe: Maybe<V>): maybe is None {
  return maybe.kind === "none";
}

export function isMaybe(value: any): value is Maybe.Any {
  return ("kind" in value && value.kind === "some") || value.kind === "none";
}
