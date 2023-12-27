import { describe, expect, it } from "vitest";
import { List } from ".";

describe("List", () => {
  describe("Factory Methods", () => {
    describe("FromArray", () => {
      it("should", () => {
        const el0 = 0;
        const el1 = 1;
        const el2 = 2;
        const el3 = 3;
        const list = List.FromArray([el0, el1, el2, el3]);
        const opt0 = list[0];
      });
    });
  });
});
