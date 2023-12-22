import { NOOF } from ".";

export type Option<V> = Some<V> | None;

export interface IOption<V> {
  unwrap(): V;
  isSome(): this is Some<V>;
  isNone(): this is None;
  onSome(fn: (some: V) => any): Option<V>;
  onNone(fn: () => any): Option<V>;
  match(matches: OptionMatch<V>): Option<V>;
  map<SomeReturn, NoneReturn>(map: {
    some: (value: V) => SomeReturn;
    none: () => NoneReturn;
  }): SomeReturn | NoneReturn;
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
  map<SomeReturn>(map: { some: (value: V) => SomeReturn }): SomeReturn {
    return map.some(this.value);
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
  map<NoneReturn>(map: { none: () => NoneReturn }): NoneReturn {
    return map.none();
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
type _Option<V> = Option<V>;

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

  export async function FromPromise<V>(promise: Promise<V>): Promise<_Option<V>> {
    try {
      return Some(await promise);
    } catch (_) {
      return None();
    }
  }

  export const isSome = _isSomeProxy;
  export const isNone = _isNoneProxy;
  export const match = _matchProxy;
}