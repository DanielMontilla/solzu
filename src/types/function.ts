/**
 * Function that takes a single `Input` argument and returns an expected `Output`
 * @template Input input type
 * @template Output expected output type
 */
export type Operator<Input, Output = Input> = (input: Input) => Output;

/**
 * Function that takes single `From` value and maps it onto `To` value
 * @template From input type
 * @template To output type
 *
 * @see {@link Operator} alias
 */
export type Mapper<From, To> = (value: From) => To;

/**
 * Function that takes no argument and always returns expected `Output`
 * @template Output
 */
export type Procedure<Output> = () => Output;

/**
 * Function that takes no arguments and always returns `void` (nothing)
 */
export type Callback = () => void;

/**
 * Function that takes input, and returns boolean based on arbitrary condition
 */
export type Predicate<Input> = (input: Input) => boolean;

/**
 * Function to perform runtime type checking
 */
export type Guard<Value> = (input: unknown) => input is Value;
