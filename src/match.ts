import { Option, OptionMatch, Result, ResultMatch, Ok, Err, optionMatch, resultMatch } from '.';

export function match<V>(
  input: Option<V>,
  matches: OptionMatch<V>
): Option<V>;
export function match<V, E>(
  input: Result<V, E>,
  matches: ResultMatch<V, E>
): Result<V, E>;
export function match<V, E>(
  input: Option<V> | Result<V, E>,
  matches: OptionMatch<V> | ResultMatch<V, E>
) {
  return input instanceof Ok || input instanceof Err
    ? resultMatch(input, matches as ResultMatch<V, E>)
    : optionMatch(input, matches as OptionMatch<V>)
};