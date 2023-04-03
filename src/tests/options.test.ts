import { test, expect } from 'vitest';
import { defineOptions } from '../index';

test('[@objetcs]', () => {

  type A = {
    a: number,
    b: number,
    t: number
  }

  function myFunc(opts?: Partial<A>): A {
    return defineOptions<A>(opts, { a: 0, b: 0, t: 0 });
  }

  const result = myFunc({a: 1});
  expect(result.a).toBe(1);
  expect(result.b).toBe(0);
  expect(result.t).toBe(0);

});