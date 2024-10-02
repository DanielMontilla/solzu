export type PropertyKey = symbol | string | number;

export type DynamicRecord = Record<PropertyKey, any>;

export type ValueOf<O extends Record<PropertyKey, any>, K extends keyof O> = O[K];

export namespace ValueOf {
  export type Or<O extends Record<PropertyKey, any>, K extends keyof O | PropertyKey, Default> =
    O extends Record<K, infer Value> ? Value : Default;

  export type OrAny<O extends Record<PropertyKey, any>, K extends keyof O | PropertyKey> = Or<
    O,
    K,
    any
  >;

  export type OrNever<O extends Record<PropertyKey, any>, K extends keyof O | PropertyKey> = Or<
    O,
    K,
    never
  >;
}
