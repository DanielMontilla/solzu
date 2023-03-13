import '../index';
import { test, expect } from 'vitest';

const properties: (keyof typeof globalThis)[] = ['mapValue', 'randomFloat'];

test('[@numbers] defined properties', () => {
  const g = globalThis;
  for (const prop of properties) {
    expect(prop in g, `${prop} is not defined`).toBe(true);
  }
});
