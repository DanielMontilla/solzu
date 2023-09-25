import { expect, describe, it } from 'vitest';
import { defineArgs } from '../';

describe(`defineArgs`, () => {
  type Args = {
    a: number,
    b: boolean,
    c?: string
  }


  it('Defines Args [001]', () => {
    const args = defineArgs<Args>({ a: 10, b: false }, { c: 'hi' });

    expect(args.a).toBe(10);
    expect(args.b).toBe(false);
    expect(args.c).toBe('hi');
  });

  it('Defines Args [002]', () => {
    const args = defineArgs<Args>({ a: -1, b: true, c: 'def' }, { c: 'other' });
  
    expect(args.a).toBe(-1);
    expect(args.b).toBe(true);
    expect(args.c).toBe('def');
  });
});