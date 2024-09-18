import { Maybe, Some } from "../maybe";
import { getWatcherMap, registerState } from "./internal";

export type State<V> = {
  value: V;
};

export namespace State {
  export type Any = State<any>;

  export type Tuple<T extends readonly [any, ...any[]] = [any, ...any[]]> = T extends readonly [
    infer V,
    ...infer Rest,
  ]
    ? [State<V>, ...{ [K in keyof Rest]: State<Rest[K]> }]
    : never;

  export type ValueOf<S extends Any> = S extends State<infer V> ? V : never;

  export type ValuesOf<S extends Tuple> = {
    [K in keyof S]: S[K] extends Any ? ValueOf<S[K]> : never;
  };
}

export function State<V>(value: V): State<V> {
  let previous = Maybe<V>();
  let current = value;

  const self: State<V> = {
    get value() {
      return current;
    },

    set value(value: V) {
      previous = Some(current);
      current = value;

      for (const callback of getWatcherMap(self).values()) {
        callback({ previous, current });
      }
    },
  };

  registerState(self);

  return self;
}
