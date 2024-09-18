import { Maybe, None } from "../maybe";
import { isArray } from "../array";
import { generateWatcherLabel, getWatcherMap } from "./internal";
import { State } from "./state";

export interface Watcher {
  dispose(): void;
}

export function Watcher<const V>(
  state: State<V>,
  callback: Watcher.Callback.Mono<V>,
  options?: Watcher.Options
): Watcher;

export function Watcher<const T extends readonly [any, ...any[]]>(
  states: State.Tuple<T>,
  callback: Watcher.Callback.Poly<T>,
  options?: Watcher.Options
): Watcher;

export function Watcher(
  stateOrStates: State.Any | State.Tuple,
  callback: Watcher.Callback.Mono | Watcher.Callback.Poly,
  options?: Watcher.Options
): Watcher {
  return isArray(stateOrStates)
    ? Watcher.Poly(stateOrStates, callback as Watcher.Callback.Poly, options)
    : Watcher.Mono(stateOrStates, callback as Watcher.Callback.Mono, options);
}

export namespace Watcher {
  export type Options = Partial<{ immediate: boolean }>;

  export type Label = number;

  export namespace Parameter {
    export type Mono<V = any> = {
      previous: Maybe<V>;
      current: V;
    };
    export type Poly<T extends readonly [any, ...any] = [any, ...any]> = {
      previous: T extends readonly [infer V, ...infer Rest]
        ? [Maybe<V>, ...{ [K in keyof Rest]: Maybe<Rest[K]> }]
        : never;
      current: T extends readonly [infer V, ...infer Rest]
        ? [V, ...{ [K in keyof Rest]: Rest[K] }]
        : never;
    };
  }

  export namespace Callback {
    export type Mono<V = any> = (params: Parameter.Mono<V>) => void;
    export type Poly<T extends readonly [any, ...any] = [any, ...any]> = (
      params: Parameter.Poly<T>
    ) => void;
  }

  export function Mono<const V>(
    state: State<V>,
    callback: Callback.Mono<V>,
    options?: Options
  ): Watcher {
    const { immediate } = { immediate: false, ...options };

    const map = getWatcherMap(state);
    const label = generateWatcherLabel(state);

    map.set(label, callback);

    if (immediate) {
      callback({ previous: None(), current: state.value });
    }

    return {
      dispose() {
        map.delete(label);
      },
    };
  }

  export function Poly<const T extends readonly [any, ...any[]]>(
    states: State.Tuple<T>,
    callback: Callback.Poly<T>,
    options?: Options
  ): Watcher {
    const { immediate } = { immediate: false, ...options };

    const watchers: Watcher[] = [];

    const current = states.map(s => s.value) as Parameter.Poly<T>["current"];
    const previous = states.map(_ => None()) as Parameter.Poly<T>["previous"];

    if (immediate) {
      callback({ previous, current });
    }

    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      const watcher = Mono(
        state,
        ({ previous: p, current: c }) => {
          previous[i] = p;
          current[i] = c;
          callback({ previous, current });
        },
        {}
      );
      watchers.push(watcher);
    }

    return {
      dispose() {
        for (const watcher of watchers) {
          watcher.dispose();
        }
      },
    };
  }
}
