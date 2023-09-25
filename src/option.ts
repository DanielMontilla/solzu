import { NOOP, NEVER, Result, ResultMatch, resultMatch } from ".";

export abstract class Option<V = unknown> {
  protected abstract _value: V;

  public static Some<V>(value: V) {
    return new Some(value);
  }

  public static get None() {
    return none;
  }

  public onSome(callback: (value: V) => any) {
    if (this instanceof Some) callback(this.value);
    return this;
  }

  public onNone(callback: () => any) {
    if (this instanceof None) callback();
    return this;
  }

  public isNone(): this is None {
    return isNone(this);
  }

  public isSome(): this is Some<V> {
    return isSome(this);
  }

  public match({ some, none }: {
    some?: (value: V) => any,
    none?: () => any,
  }) {
    return this
      .onSome(some ?? NOOP)
      .onNone(none ?? NOOP);
  }
}

export class Some<V> extends Option<V> {
  constructor(
    protected _value: V,
  ) { super() }

  get value() {
    return this._value;
  }
}

export class None extends Option<never> {
  protected _value = NEVER;
  constructor() { super() }
}

export function some<V>(value: V) {
  return new Some(value);
}

export const none = new None();

export function isSome<V>(option: Option<V>): option is Some<V> {
  return option instanceof Some;
}

export function isNone(option: Option<any>): option is None {
  return option instanceof None;
}

export type OptionMatch<V> = {
  some?: (value: V) => void;
  none?: () => void;
}

export function optionMatch<V>(
  option: Option<V>,
  matches: OptionMatch<V>
) {
  if ((isSome(option) && matches.some)) matches.some(option.value);
  if (isNone(option) && matches.none) matches.none();
}

// TODO: maybe move elsewhere
export function match<V>(
  input: Option<V>,
  matches: OptionMatch<V>
): void;
export function match<V, E>(
  input: Result<V, E>,
  matches: ResultMatch<V, E>
): void;
export function match<V, E>(
  input: Option<V> | Result<V, E>,
  matches: OptionMatch<V> | ResultMatch<V, E>
) {
  if (input instanceof Option) {
    optionMatch(input, matches as OptionMatch<V>);
  } else {
    resultMatch(input, matches as ResultMatch<V, E>);
  }
};