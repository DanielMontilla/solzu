import { isArray } from "../array";
import { cast } from "../macros";
import { State } from "./state";
import { Watcher } from "./watcher";

export interface Computed<V> extends State<V>, Watcher {
  readonly value: V;
}

export function Computed<const I, const V = I>(
  state: State<I>,
  callback: Computed.Callback.Mono<I, V>
): Computed<V>;

export function Computed<const T extends readonly [any, ...any[]], const V>(
  states: State.Tuple<T>,
  callback: Computed.Callback.Poly<T>
): Computed<V>;

export function Computed(
  stateOrStates: State.Any | State.Tuple,
  callback: Computed.Callback.Mono | Computed.Callback.Poly
): Computed<any> {
  return isArray(stateOrStates)
    ? Computed.Poly(stateOrStates, callback)
    : Computed.Mono(stateOrStates, callback);
}

export namespace Computed {
  export namespace Callback {
    export type Mono<I = any, V = I> = (value: I) => V;
    export type Poly<I extends readonly [any, ...any[]] = [any, ...any[]], V = any> = (
      values: I
    ) => V;
  }

  export function Mono<const I, const V = I>(
    state: State<I>,
    callback: Callback.Mono<I, V>
  ): Computed<V> {
    const computed = State(callback(state.value));
    const watcher = Watcher.Mono(state, ({ current }) => (computed.value = callback(current)));

    return {
      get value() {
        return computed.value;
      },

      dispose() {
        watcher.dispose();
      },
    };
  }

  export function Poly<const T extends readonly [any, ...any[]], const V>(
    states: State.Tuple<T>,
    callback: Callback.Poly<T>
  ): Computed<V> {
    const computed = State(callback(cast<T>(states.map(state => state.value))));
    const watcher = Watcher.Poly(
      states,
      ({ current }) => (computed.value = callback(cast<T>(current)))
    );

    return {
      get value() {
        return computed.value;
      },

      dispose() {
        watcher.dispose();
      },
    };
  }
}
