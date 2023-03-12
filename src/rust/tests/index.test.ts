import '../index';
import { test, expect } from 'vitest';

const properties: (keyof typeof globalThis)[] = ['ok', 'err', 'errs', 'isOk', 'isErr', 'check']

test('[@rust] defined properties', () => {
  const g = globalThis;
  for (const prop of properties) {
    expect(prop in g, `${prop} is not defined`).toBe(true);
  }
});
