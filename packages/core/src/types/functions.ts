// export type Predicate<In> = (value: In) => boolean;
// export type Effect<T = never> = [T] extends [never] ? () => any : (x: T) => any;
// export type Procedure<Input, Output = Input> = (input: Input) => Output;
// export type Mapper<From, To> = Procedure<From, To>;

export type Proc<Input, Output> = (input: Input) => Output;

export type Procedure<Input, Output> = (input: Input) => Output;

export namespace Procedure {
  export type Any = Procedure<any, any>;

  export type InputOf<P extends Procedure.Any> =
    P extends Procedure<infer I, any> ? I : never;

  export type OutputOf<P extends Procedure.Any> =
    P extends Procedure<any, infer O> ? O : never;
}
