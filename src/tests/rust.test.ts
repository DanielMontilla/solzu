import { test, expect } from 'vitest';
import { ok } from '../index';

test('[@rust]', () => {
  let result = ok(10);
  expect(result.value).toBe(10);
});