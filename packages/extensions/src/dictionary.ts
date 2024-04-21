import { type Maybe, type Procedure, Some, None } from "solzu";

export type Dictionary<K, V> = { kind: "dictionary"; map: Map<K, V> };

export namespace Dictionary {
  export type Any = Dictionary<any, any>;
}

export type KeyOf<D extends Dictionary.Any> =
  D extends Dictionary<infer K, any> ? K : never;
export type ValueOf<D extends Dictionary.Any> =
  D extends Dictionary<any, infer V> ? V : never;

export function Dictionary<K, V>(): Dictionary<K, V>;
export function Dictionary<K, V>(map?: Map<K, V>): Dictionary<K, V> {
  return { kind: "dictionary", map: map ? map : new Map<K, V>() };
}

export function tryGet<D extends Dictionary.Any>(
  key: KeyOf<D>
): Procedure<D, Maybe<ValueOf<D>>> {
  return ({ map }: D) => {
    const value = map.get(key);

    return value !== undefined ? Some(value) : None();
  };
}
