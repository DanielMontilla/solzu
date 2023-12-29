import { describe, it, expect } from "vitest";
import { defineArgs } from "../..";

describe("defineArgs", () => {
  it("should require missing props + correctly output merged object", () => {
    type Params = {
      prop1: number;
      prop2?: number;
    };

    const input: Params = { prop1: 0 };
    const args = defineArgs(input, { prop2: 0 });
    // ^? { prop1: number, prop2: number } = Required<Params>;
    expect(args).toHaveProperty(["prop1"]);
    expect(args).toHaveProperty(["prop2"]);
    expect(args).toEqual({ prop1: 0, prop2: 0 });
  });

  it("should not overwrite provided optional props", () => {
    type Params = {
      prop1: number;
      prop2?: number;
    };

    const input: Params = { prop1: 0, prop2: 1 };
    const args = defineArgs(input, { prop2: 0 });
    expect(args).toHaveProperty(["prop1"]);
    expect(args).toHaveProperty(["prop2"]);
    expect(args).toEqual({ prop1: 0, prop2: 1 });
  });

  it("should require entire record if possibly undefined", () => {
    type Params = {
      prop1: number;
      prop2?: number;
    };

    const input = undefined;
    const args = defineArgs<Params | undefined>(input, { prop1: 0, prop2: 0 });
    expect(args).toHaveProperty(["prop1"]);
    expect(args).toHaveProperty(["prop2"]);
    expect(args).toEqual({ prop1: 0, prop2: 0 });
  });

  it("should not overwrite set props, even when possibly undefined", () => {
    type Params = {
      prop1: number;
      prop2?: number;
    };

    const input = { prop1: 0, prop2: 1 };
    const args = defineArgs<Params | undefined>(input, { prop1: 1, prop2: 0 });
    expect(args).toHaveProperty(["prop1"]);
    expect(args).toHaveProperty(["prop2"]);
    expect(args).toEqual({ prop1: 0, prop2: 1 });
  });

  it("should properly build record with possibly undefined leaf properties", () => {
    type Params = {
      prop1: number;
      prop2: {
        nested1: string;
        nested2?: number;
      };
    };

    const input: Params = { prop1: 1, prop2: { nested1: "hello" } };
    const args = defineArgs(input, { prop2: { nested2: 1 } });
    expect(args).toHaveProperty(["prop1"]);
    expect(args).toHaveProperty(["prop2"]);
    expect(args).toHaveProperty(["prop2", "nested1"]);
    expect(args).toHaveProperty(["prop2", "nested2"]);
    expect(args).toEqual({ prop1: 1, prop2: { nested1: "hello", nested2: 1 } });
  });

  it("should not overwrite possibly undefined leafs if they are defined in input", () => {
    type Params = {
      prop1: number;
      prop2: {
        nested1: string;
        nested2?: number;
      };
    };

    const input: Params = { prop1: 1, prop2: { nested1: "hello", nested2: 0 } };
    const args = defineArgs(input, { prop2: { nested2: 1 } });
    expect(args).toHaveProperty(["prop1"]);
    expect(args).toHaveProperty(["prop2"]);
    expect(args).toHaveProperty(["prop2", "nested1"]);
    expect(args).toHaveProperty(["prop2", "nested2"]);
    expect(args).toEqual({ prop1: 1, prop2: { nested1: "hello", nested2: 0 } });
  });
});
