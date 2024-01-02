export type Predicate<In, _Out = In> = (value: In) => boolean;
export type Predicate_<In> = (value: In) => boolean;
export type Guard<Out> = (value: unknown) => value is Out;
export type Assertion<In, Out extends In> = (value: In) => value is Out;

export type Mapper<From, To> = [From] extends [never]
  ? () => To
  : (value: From) => To;
export type Alternate<To> = Mapper<never, To>;

export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

export type RecordKey = keyof any;
export type AnyRecord = Record<RecordKey, any>;
export type GenericRecord<T = any> = Record<RecordKey, T>;
export type Entry<K extends RecordKey, V> = [K, V];
export type Entries<K extends RecordKey, V> = Array<Entry<K, V>>;

export type Dictionary<K extends RecordKey, T> = {
  [P in K]?: T;
};

export type ExtractOptional<T extends GenericRecord> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
};

export type RequiredDeep<T> = T extends (...args: any) => any
  ? NonNullable<T>
  : {
      [K in keyof T]-?: NonNullable<T[K]> extends GenericRecord
        ? RequiredDeep<NonNullable<T[K]>>
        : NonNullable<T[K]>;
    };

export type ExtractArgs<T extends GenericRecord | undefined> =
  undefined extends T
    ? RequiredDeep<NonNullable<T>>
    : RequiredDeep<
        {
          [K in keyof T as undefined extends T[K]
            ? K
            : never]: T[K] extends GenericRecord
            ? ExtractArgs<T[K]>
            : NonNullable<T[K]>;
        } & {
          [K in keyof T as T[K] extends GenericRecord ? K : never]: ExtractArgs<
            NonNullable<T[K]>
          >;
        }
      >;

export type AssertEqual<T, Expected> = [T] extends [Expected]
  ? [Expected] extends [T]
    ? true
    : never
  : never;

export type Empty = void;
