export type Procedure<Input, Output = Input> = (input: Input) => Output;
export type Callback<Output> = () => Output;
