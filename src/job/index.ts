import { Procedure, Operator } from "../types";

/**
 * @description takes `input` through a sequence of transformations
 * @template Input type of passed value
 * @template Output type of expected output
 * @param {Input | Procedure<Input>} input starting value
 * @returns {Output} output. End value
 */
export function job<Input, Output>(
  input: Input | Procedure<Input>,
  operator: Operator<Input, Output>
): Output;

export function job<Input, A, Output>(
  input: Input | Procedure<Input>,
  operatorA: Operator<Input, A>,
  operator: Operator<A, Output>
): Output;

export function job<Input, A, B, Output>(
  input: Input | Procedure<Input>,
  operatorA: Operator<Input, A>,
  operatorB: Operator<A, B>,
  operator: Operator<B, Output>
): Output;

export function job<Input, A, B, C, Output>(
  input: Input | Procedure<Input>,
  operatorA: Operator<Input, A>,
  operatorB: Operator<A, B>,
  operatorC: Operator<B, C>,
  operator: Operator<C, Output>
): Output;

export function job<Input, A, B, C, D, Output>(
  input: Input | Procedure<Input>,
  operatorA: Operator<Input, A>,
  operatorB: Operator<A, B>,
  operatorC: Operator<B, C>,
  operatorD: Operator<C, D>,
  operator: Operator<D, Output>
): Output;

export function job<Input, A, B, C, D, E, Output>(
  input: Input | Procedure<Input>,
  operatorA: Operator<Input, A>,
  operatorB: Operator<A, B>,
  operatorC: Operator<B, C>,
  operatorD: Operator<C, D>,
  operatorE: Operator<D, E>,
  operator: Operator<E, Output>
): Output;

export function job<Input, A, B, C, D, E, F, Output>(
  input: Input | Procedure<Input>,
  operatorA: Operator<Input, A>,
  operatorB: Operator<A, B>,
  operatorC: Operator<B, C>,
  operatorD: Operator<C, D>,
  operatorE: Operator<D, E>,
  operatorF: Operator<E, F>,
  operator: Operator<F, Output>
): Output;

export function job<Input, A, B, C, D, E, F, G, Output>(
  input: Input | Procedure<Input>,
  operatorA: Operator<Input, A>,
  operatorB: Operator<A, B>,
  operatorC: Operator<B, C>,
  operatorD: Operator<C, D>,
  operatorE: Operator<D, E>,
  operatorF: Operator<E, F>,
  operatorG: Operator<F, G>,
  operator: Operator<G, Output>
): Output;

export function job(input: any, ...operators: Function[]): any {
  let result = typeof input === "function" ? input() : input;
  for (let procedure of operators) result = procedure(result);
  return result;
}
