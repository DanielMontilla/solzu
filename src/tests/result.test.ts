import { describe, it, expect } from 'vitest';
import { Result, err, ok } from '../index';

describe(`Result`, () => {

  it('unwraps result', () => {
    let result: Result<number, string>;
    result = ok(10);
    expect(result.unwrap()).toBe(10);
    
    result = err('error! >:)');
    expect(() => result.unwrap()).toThrow('error! >:)');
  })
});