import '../index';
import { test, expect } from 'vitest';

const properties: (keyof typeof globalThis)[] = ['defineOptions', 'NOOP'];

test('[@objects] defined properties', () => {
  const g = globalThis;
  for (const prop of properties) {
    expect(prop in g, `${prop} is not defined`).toBe(true);
  }
});
