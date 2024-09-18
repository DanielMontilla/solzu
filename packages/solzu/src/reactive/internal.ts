import { State } from "./state";
import { Watcher } from "./watcher";

const watcherRegistry = new WeakMap<State.Any, Map<Watcher.Label, Watcher.Callback.Mono>>();
const watcherLabelRegistry = new WeakMap<State.Any, number>();

export const registerState = (state: State.Any) => {
  watcherRegistry.set(state, new Map());
};

export const getWatcherMap = <V>(state: State<V>) => {
  return watcherRegistry.get(state)! as Map<Watcher.Label, Watcher.Callback.Mono<V>>;
};

export const generateWatcherLabel = (state: State.Any) => {
  const next = watcherLabelRegistry.get(state)! + 1;
  watcherLabelRegistry.set(state, next);
  return next;
};
