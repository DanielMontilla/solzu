import { describe, it, expect } from 'vitest';
import { keyIn } from '../objects';

describe(`Objects`, () => {

  it('keys if key in object', () => {
    const obj = {
      1: 'one',
      'two': 'two',
      'three': true
    }

    let key1: string | number | symbol = 1;
    let key2: string | number | symbol = 'two';
    let key3: string | number | symbol = 'three';
    let key4: string | number | symbol = 'one';

    expect(keyIn(obj, key1)).toBe(true);
    expect(keyIn(obj, key2)).toBe(true);
    expect(keyIn(obj, key3)).toBe(true);
    expect(keyIn(obj, key4)).toBe(false);
  });
});