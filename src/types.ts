/**
 * A utility type that recursively applies the `Partial` type to a given type `T`.
 * @template T - The type to be partially defined.
 * 
 * @author Daniel Montilla
*/
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type ExtractOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
}

export type RequiredOptional<T> = Required<ExtractOptional<T>>