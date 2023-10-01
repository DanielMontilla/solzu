import { NOOF } from ".";

export type Option<V> = Some<V> | None;

export interface IOption<T> {
  unwrap(): T;
  isSome(): this is Some<T>;
  isNone(): this is None;
  onSome(fn: (some: T) => any): Option<T>;
  onNone(fn: () => any): Option<T>;
  match(matches: OptionMatch<T>): Option<T>;
}

export class Some<V> implements IOption<V> {
  constructor(
    protected _value: V,
  ) { }

  get value() { return this._value }
  unwrap(): V { return this.value }
  isSome(): this is Some<V> { return true }
  isNone(): this is None { return false }
  onNone(_: () => any): Option<V> { return this }
  onSome(fn: (some: V) => any): Option<V> {
    fn(this.value);
    return this;
  }
  match(matches: OptionMatch<V>): Option<V> {
    return this.onSome(matches.some ?? NOOF);
  }
}

export class None implements IOption<never> {
  constructor() { }
  unwrap(): never { throw Error('Trying to unwrap a `None` value') }
  isSome(): this is Some<never> { return false }
  isNone(): this is None { return true }
  onSome(_: (some: never) => any): Option<never> { return this }
  onNone(fn: () => any): Option<never> {
    fn();
    return this;
  }
  match(matches: OptionMatch<never>): Option<never> {
    return this.onNone(matches.none ?? NOOF);
  }
}

export function some<V>(value: V) {
  return new Some(value);
}

const _none = new None();
export function none() {
  return _none;
}

export function isSome<V>(option: Option<V>): option is Some<V> {
  return option.isSome();
}

export function isNone<V>(option: Option<V>): option is None {
  return option.isNone();
}

export type OptionMatch<V> = {
  some?: (value: V) => void;
  none?: () => void;
}

export function optionMatch<V>(option: Option<V>, matches: OptionMatch<V>): Option<V> {
  return option.match(matches);
}

type _Some<V> = Some<V>;
type _None = None;

const _SomeProxy = Some;
const _NoneProxy = None;
const _matchProxy = optionMatch;
const _isSomeProxy = isSome;
const _isNoneProxy = isNone;

export namespace Option {
  export function Some<V>(value: V): _Some<V> {
    return new _SomeProxy(value);
  }

  export function None(): _None {
    return new _NoneProxy();
  }

  export const isSome = _isSomeProxy;
  export const isNone = _isNoneProxy;
  export const match = _matchProxy;
}