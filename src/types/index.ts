export type Predicate<In, _Out = In> = (value: In) => boolean;
export type Transformer<From, To> = (value: From) => To;
