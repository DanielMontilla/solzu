import { NOOP, NEVER } from ".";

export abstract class Option<V = unknown> {
  protected abstract _value: V;

  public static Some<V>(value: V) {
    return new Some(value);
  }

  public static None() {
    return new None();
  }

  public onSome(callback: (value: V) => any) {
    if (this instanceof Some) callback(this.value);
    return this;
  }

  public onNone(callback: () => any) {
    if (this instanceof None) callback();
    return this;
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

export function none() {
  return new None();
}

export function isSome<V>(option: Option<V>): option is Some<V> {
  return option instanceof Some;
}

export function isNone(option: Option<any>): option is None {
  return option instanceof None;
}


export function match<V>(
  option: Option<V>,
  branches: {
    some?: (value: V) => void;
    none?: () => void;
  }
) {
  if ((isSome(option) && branches.some)) branches.some(option.value);
  if (isNone(option) && branches.none) branches.none();
}