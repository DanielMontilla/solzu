import { test, expect } from 'vitest';
import { Result, err, ok } from '../index';

test('[@rust] unwrap', () => {
  let result: Result<number, string>;
  result = ok(10);
  expect(result.unwrap()).toBe(10);

  result = err('error! >:)');
  expect(() => result.unwrap()).toThrow('error! >:)');
});