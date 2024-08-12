import { isPromise } from "util/types";
import { isFunction } from "../../modules";
import { Procedure, Operator, Func } from "../../types";

/**
 * Takes `input` through a sequence of *possibly* asynchronous transformations.
 *
 * @template Input - The type of the input value.
 * @param {Input | Promise<Input> | Procedure<Input>} input - The starting value, which can be a value, a promise, or a function that returns a value.
 * @returns {Promise<Input>} - A promise that resolves to the original input value after all transformations (if any).
 */
export async function task<Input>(
  input: Input | Promise<Input> | Procedure<Input>
): Promise<Input>;

/**
 * Takes `input` through a sequence of *possibly* asynchronous transformations.
 *
 * @template Input - The type of the input value.
 * @template Output - The type of the expected output value.
 * @param {Input | Promise<Input> | Procedure<Input>} input - The starting value, which can be a value, a promise, or a function that returns a value.
 * @param {Operator<Input, Output> | Operator.Async<Input, Output>} operator - An operator function that transforms the input to the output.
 * @returns {Promise<Output>} - A promise that resolves to the final output value.
 */
export async function task<Input, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operator: Operator<Input, Output> | Operator.Async<Input, Output>
): Promise<Output>;

export async function task<Input, A, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operator: Operator<A, Output> | Operator.Async<A, Output>
): Promise<Output>;

export async function task<Input, A, B, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operatorB: Operator<A, B> | Operator.Async<A, B>,
  operator: Operator<B, Output> | Operator.Async<B, Output>
): Promise<Output>;

export async function task<Input, A, B, C, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operatorB: Operator<A, B> | Operator.Async<A, B>,
  operatorC: Operator<B, C> | Operator.Async<B, C>,
  operator: Operator<C, Output> | Operator.Async<C, Output>
): Promise<Output>;

export async function task<Input, A, B, C, D, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operatorB: Operator<A, B> | Operator.Async<A, B>,
  operatorC: Operator<B, C> | Operator.Async<B, C>,
  operatorD: Operator<C, D> | Operator.Async<C, D>,
  operator: Operator<D, Output> | Operator.Async<D, Output>
): Promise<Output>;

export async function task<Input, A, B, C, D, E, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operatorB: Operator<A, B> | Operator.Async<A, B>,
  operatorC: Operator<B, C> | Operator.Async<B, C>,
  operatorD: Operator<C, D> | Operator.Async<C, D>,
  operatorE: Operator<D, E> | Operator.Async<D, E>,
  operator: Operator<E, Output> | Operator.Async<E, Output>
): Promise<Output>;

export async function task<Input, A, B, C, D, E, F, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operatorB: Operator<A, B> | Operator.Async<A, B>,
  operatorC: Operator<B, C> | Operator.Async<B, C>,
  operatorD: Operator<C, D> | Operator.Async<C, D>,
  operatorE: Operator<D, E> | Operator.Async<D, E>,
  operatorF: Operator<E, F> | Operator.Async<E, F>,
  operator: Operator<F, Output> | Operator.Async<F, Output>
): Promise<Output>;

export async function task<Input, A, B, C, D, E, F, G, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operatorB: Operator<A, B> | Operator.Async<A, B>,
  operatorC: Operator<B, C> | Operator.Async<B, C>,
  operatorD: Operator<C, D> | Operator.Async<C, D>,
  operatorE: Operator<D, E> | Operator.Async<D, E>,
  operatorF: Operator<E, F> | Operator.Async<E, F>,
  operatorG: Operator<F, G> | Operator.Async<F, G>,
  operator: Operator<G, Output> | Operator.Async<G, Output>
): Promise<Output>;

export async function task<Input, A, B, C, D, E, F, G, H, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operatorB: Operator<A, B> | Operator.Async<A, B>,
  operatorC: Operator<B, C> | Operator.Async<B, C>,
  operatorD: Operator<C, D> | Operator.Async<C, D>,
  operatorE: Operator<D, E> | Operator.Async<D, E>,
  operatorF: Operator<E, F> | Operator.Async<E, F>,
  operatorG: Operator<F, G> | Operator.Async<F, G>,
  operatorH: Operator<G, H> | Operator.Async<G, H>,
  operator: Operator<H, Output> | Operator.Async<H, Output>
): Promise<Output>;

export async function task<Input, A, B, C, D, E, F, G, H, I, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operatorB: Operator<A, B> | Operator.Async<A, B>,
  operatorC: Operator<B, C> | Operator.Async<B, C>,
  operatorD: Operator<C, D> | Operator.Async<C, D>,
  operatorE: Operator<D, E> | Operator.Async<D, E>,
  operatorF: Operator<E, F> | Operator.Async<E, F>,
  operatorG: Operator<F, G> | Operator.Async<F, G>,
  operatorH: Operator<G, H> | Operator.Async<G, H>,
  operatorI: Operator<H, I> | Operator.Async<H, I>,
  operator: Operator<I, Output> | Operator.Async<I, Output>
): Promise<Output>;

export async function task<Input, A, B, C, D, E, F, G, H, I, J, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operatorB: Operator<A, B> | Operator.Async<A, B>,
  operatorC: Operator<B, C> | Operator.Async<B, C>,
  operatorD: Operator<C, D> | Operator.Async<C, D>,
  operatorE: Operator<D, E> | Operator.Async<D, E>,
  operatorF: Operator<E, F> | Operator.Async<E, F>,
  operatorG: Operator<F, G> | Operator.Async<F, G>,
  operatorH: Operator<G, H> | Operator.Async<G, H>,
  operatorI: Operator<H, I> | Operator.Async<H, I>,
  operatorJ: Operator<I, J> | Operator.Async<I, J>,
  operator: Operator<J, Output> | Operator.Async<J, Output>
): Promise<Output>;

export async function task<Input, A, B, C, D, E, F, G, H, I, J, K, Output>(
  input: Input | Promise<Input> | Procedure<Input>,
  operatorA: Operator<Input, A> | Operator.Async<Input, A>,
  operatorB: Operator<A, B> | Operator.Async<A, B>,
  operatorC: Operator<B, C> | Operator.Async<B, C>,
  operatorD: Operator<C, D> | Operator.Async<C, D>,
  operatorE: Operator<D, E> | Operator.Async<D, E>,
  operatorF: Operator<E, F> | Operator.Async<E, F>,
  operatorG: Operator<F, G> | Operator.Async<F, G>,
  operatorH: Operator<G, H> | Operator.Async<G, H>,
  operatorI: Operator<H, I> | Operator.Async<H, I>,
  operatorJ: Operator<I, J> | Operator.Async<I, J>,
  operatorK: Operator<J, K> | Operator.Async<J, K>,
  operator: Operator<K, Output> | Operator.Async<K, Output>
): Promise<Output>;

/**
 * @internal
 */
export async function task(input: any, ...operators: Func[]): Promise<any> {
  let value =
    isFunction(input) ? input()
    : isPromise(input) ? await input
    : input;

  for (let procedure of operators) value = await procedure(value);
  return value;
}
