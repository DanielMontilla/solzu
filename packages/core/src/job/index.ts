import { Proc, Procedure } from "../types";

export const NEVER = null as never;

export const cast = <To>(value: unknown) => value as To;

export class Job<Input> {
  public return(): Input {
    return this.inner as Input;
  }

  constructor(private inner: any) {}

  public set<T>(value: T): Job<T> {
    this.inner = value;
    return cast<Job<T>>(this);
  }

  // public pipe<Output>(procedure: Proc<T, Output>): Job<Output> {
  //   return this.set(procedure(this.return()));
  // }

  public ql<Output>(procedure: Procedure<Input, Output>): Job<Output> {
    throw "";
  }
}

export function job(): Job<never>;
export function job<V>(value: V): Job<V>;
export function job<V>(value?: V): Job<V> | Job<never> {
  return value !== undefined ? new Job(value) : new Job(NEVER);
}
