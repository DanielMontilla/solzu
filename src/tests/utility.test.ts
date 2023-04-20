import { test, expect } from 'vitest';
import { defineOptions } from '../utility';

test('[@utilty] options', () => {

  type Options = {
    a: number,
    b: boolean,
    c?: string
  }

  const opts1 = defineOptions<Options>({ a: 10, b: false }, {
    c: 'hi'
  });

  expect(opts1.a).toBe(10);
  expect(opts1.b).toBe(false);
  expect(opts1.c).toBe('hi');

  const opts2 = defineOptions<Options>({ a: -1, b: true, c: 'def' }, {
    c: 'other'
  });

  expect(opts2.a).toBe(-1);
  expect(opts2.b).toBe(true);
  expect(opts2.c).toBe('def');

});