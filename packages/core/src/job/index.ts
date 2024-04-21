import { Callback, Procedure } from "../types";

export function job<Initial>(value: Initial | Callback<Initial>): Initial;
export function job<Initial, Output>(
  value: Initial | Callback<Initial>,
  $0: Procedure<Initial, Output>
): Output;
export function job<Start, A, Output>(
  value: Start | Callback<Start>,
  $0: Procedure<Start, A>,
  $1: Procedure<A, Output>
): Output;
export function job<Start, A, B, Output>(
  value: Start | Callback<Start>,
  $0: Procedure<Start, A>,
  $1: Procedure<A, B>,
  $2: Procedure<B, Output>
): Output;
export function job<Start, A, B, C, Output>(
  value: Start | Callback<Start>,
  $0: Procedure<Start, A>,
  $1: Procedure<A, B>,
  $2: Procedure<B, C>,
  $3: Procedure<C, Output>
): Output;
export function job<Start, A, B, C, D, Output>(
  value: Start | Callback<Start>,
  $0: Procedure<Start, A>,
  $1: Procedure<A, B>,
  $2: Procedure<B, C>,
  $3: Procedure<C, D>,
  $4: Procedure<D, Output>
): Output;
export function job<Start, A, B, C, D, E, Output>(
  value: Start | Callback<Start>,
  $0: Procedure<Start, A>,
  $1: Procedure<A, B>,
  $2: Procedure<B, C>,
  $3: Procedure<C, D>,
  $4: Procedure<D, E>,
  $5: Procedure<E, Output>
): Output;
export function job<Start, A, B, C, D, E, F, Output>(
  value: Start | Callback<Start>,
  $0: Procedure<Start, A>,
  $1: Procedure<A, B>,
  $2: Procedure<B, C>,
  $3: Procedure<C, D>,
  $4: Procedure<D, E>,
  $5: Procedure<E, F>,
  $6: Procedure<F, Output>
): Output;
export function job<Start, A, B, C, D, E, F, G, Output>(
  value: Start | Callback<Start>,
  $0: Procedure<Start, A>,
  $1: Procedure<A, B>,
  $2: Procedure<B, C>,
  $3: Procedure<C, D>,
  $4: Procedure<D, E>,
  $5: Procedure<E, F>,
  $6: Procedure<F, G>,
  $7: Procedure<G, Output>
): Output;

export function job(valueOrFn: any, ...procedures: Function[]): any {
  let result = typeof valueOrFn === "function" ? valueOrFn() : valueOrFn;
  for (let procedure of procedures) result = procedure(result);
  return result;
}
