/**
 * A utility type that recursively applies the `Partial` type to a given type `T`.
 * @template T - The type to be partially defined.
 * 
 * @author Daniel Montilla
*/
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

/**
 * A utility type that creates a new type by picking the properties from `T` that are not in the `K` union and making the properties in the `K` union optional.
 * @template T - The type from which to pick properties.
 * @template K - A union of keys from `T` to make optional.
 * 
 * @author Daniel Montilla
 */
export type PickOptional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Partial<Pick<T, K>>;
