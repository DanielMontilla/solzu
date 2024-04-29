/**
 * @description function that takes a single `Input` argument and returns an expected `Output`
 * @template Input input type of function call
 * @template Output expected output type of function call
 */
export type Operator<Input, Output = Input> = (input: Input) => Output;

/**
 * @description function that takes no argument and always returns expected `Output`
 * @template Output
 */
export type Procedure<Output> = () => Output;

/**
 * @description function that takes no arguments and always returns `void` (nothing)
 */
export type Callback = () => void;
