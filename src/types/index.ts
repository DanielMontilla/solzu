export type Predicate<In, _Out = In> = (value: In) => boolean;
export type Mapper<From, To> = [From] extends [never]
  ? () => To
  : (value: From) => To;
export type Alternate<To> = Mapper<never, To>;

export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

/**
 * A utility type that recursively applies the `Partial` type to a given type `T`.
 * @template T - The type to be partially defined.
 *
 * @author Daniel Montilla
 */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Dictionary<K extends keyof any, T> = {
  [P in K]?: T;
};

export type ExtractOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
};

export type RequiredOptional<T> = Required<ExtractOptional<T>>;
