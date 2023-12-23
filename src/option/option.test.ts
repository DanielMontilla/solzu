import { describe, it } from "vitest";
import { Option } from '.';
import { expect } from "vitest";

describe("Option", () => {

  it("Some.unwrap", () => {
    const value = 0;
    const opt = Option.Pure(value);
    expect(opt.unwrap()).toBe(value);
  });

  it("None.unwrap", () => {
    const opt = Option.Pure();
    expect(opt.unwrap).toThrowError()
  });
  
  it("Some.isSome/isNone", () => {
    const value = 0;
    const opt = Option.Pure(value);
    expect(opt.isSome()).toBe(true);
    expect(opt.isNone()).toBe(false);
  });

  it("None.isSome/isNone", () => {
    const opt = Option.Pure();
    expect(opt.isSome()).toBe(false);
    expect(opt.isNone()).toBe(true);
  });

  it("Some.onSome/onNone", () => {
    const value = 5;
    const opt = Option.Pure(value);

    let foo = 0;

    opt.onSome(v => foo += v);

    expect(foo).toBe(value);

    opt.onNone(() => foo + 1);

    expect(foo).toBe(value);
  });

  it("None.onSome/onNone", () => {
    const opt = Option.Pure<number>();

    let foo = 0;

    opt.onSome(v => foo += v);

    expect(foo).toBe(0);

    const value = 1;

    opt.onNone(() => foo = value);

    expect(foo).toBe(value);
  });

  it("Some.mapSome", () => {
    const value = 1;
    const mult = 2;
    const opt = Option.Pure(0)
      .mapSome(x => x + value)
      .mapSome(x => x + value)
      .mapSome(x => x + value)
      .mapSome(x => x * mult)
      .mapSome(x => `${x}`);
    
      const expected = `${(value * 3) * mult}`;
      
      expect(opt.isSome()).toBe(true);
      expect(opt.unwrap()).toBe(expected);
    });
    
    it("None.mapSome", () => {
      const opt = Option.Pure<number>()
        .mapSome(x => x * 2);

      expect(opt.isNone()).toBe(true);
    });

    it("Some.toResult", () => {
      const value = 0;
      const error = 'error!';
      const res = Option.Pure<number>(value)
        .toResult(error);

      expect(res.isOk()).toBe(true);
      expect(res.unwrapOk()).toBe(value);
    });

    it("None.toResult", () => {
      const error = 'error!';
      const res = Option.Pure<number>()
        .toResult(error);

      expect(res.isErr()).toBe(true);
      expect(res.unwrapErr()).toBe(error);
    });
});