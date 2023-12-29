import { describe, it, expectTypeOf, vi } from "vitest";
import { ExtractArgs } from "..";

describe("ExtractRequiredArgs", () => {
  it("should extract and make required only the possibly undefined properties", () => {
    type Example = { prop1: number; prop2?: number };
    type Test = ExtractArgs<Example>;
    type Expected = { prop2: number };

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  it("should make the entire object required if possibly undefined", () => {
    type Example = { prop1: number; prop2?: number } | undefined;
    type Test = ExtractArgs<Example>;
    type Expected = { prop1: number; prop2: number };

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  it("should only make sub-object required if one or more of its nested properties are possibly undefined", () => {
    type Example = {
      prop1: number;
      prop2: { nestedProp1: string; nestedProp2?: boolean };
    };
    type Test = ExtractArgs<Example>;
    type Expected = { prop2: { nestedProp2: boolean } };

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  it("should only make possibly undefined sub-objects required along with all of its properties", () => {
    type Example = {
      prop1: number;
      prop2?: { nestedProp1: string; nestedProp2: boolean };
    };
    type Test = ExtractArgs<Example>;
    type Expected = { prop2: { nestedProp1: string; nestedProp2: boolean } };

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  it("should only make possibly undefined sub-objects required along with all of its properties (even when those are undefined)", () => {
    type Example = {
      prop1: number;
      prop2?: { nestedProp1: string; nestedProp2?: boolean };
    };
    type Test = ExtractArgs<Example>;
    type Expected = { prop2: { nestedProp1: string; nestedProp2: boolean } };

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  it("should handle method props", () => {
    type Example = {
      prop1: number;
      prop2?: () => number;
    };

    type Test = ExtractArgs<Example>;
    type Expected = {
      prop2: () => number;
    };

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  it("should handle complex cases!", () => {
    type Example = {
      a: string;
      b: number;
      c: { d?: string; e: boolean };
      f?: { g: { h: string; i: number }; j?: {}; k: number | boolean };
      l: { m: string | symbol; n?: number };
      p?: string;
    };
    type Test = ExtractArgs<Example>;
    type Expected = {
      c: { d: string };
      f: { g: { h: string; i: number }; j: {}; k: number | boolean };
      l: { n: number };
      p: string;
    };

    expectTypeOf<Test>().toEqualTypeOf<Expected>();
  });

  // it("should handle class instances", () => {
  //   class MockClass {
  //     constructor(public prop1: number) {}
  //     method1() {}
  //   }

  //   type Example = {
  //     prop1: number;
  //     prop2?: MockClass;
  //   };

  //   type Test = ExtractArgs<Example>;
  //   type Expected = { prop2: MockClass };

  //   expectTypeOf<Test>().toEqualTypeOf<Expected>();
  // });
});
