import { describe, it } from "vitest";
import { delay } from "..";

describe.concurrent("Promise", () => {
  it("should resolve with undefined after a positive duration in resolve mode without value", async ({
    expect,
  }) => {
    const result = await delay(100, { mode: "resolve" });
    expect(result).toBeUndefined();
  });

  it("should resolve with the provided value after a positive duration in resolve mode", async ({
    expect,
  }) => {
    const value = "test";
    const result = await delay(100, { mode: "resolve", value });
    expect(result).toBe(value);
  });

  it("should reject after a positive duration in reject mode", async ({
    expect,
  }) => {
    expect(delay(100, { mode: "reject" })).rejects.toThrow(
      "Rejected by delay function"
    );
  });

  it("should throw immediately for zero duration", ({ expect }) => {
    expect(() => delay(0, { mode: "resolve" })).toThrow("Invalid duration 0");
  });

  it("should throw immediately for negative duration", ({ expect }) => {
    expect(() => delay(-100, { mode: "resolve" })).toThrow(
      "Invalid duration -100"
    );
  });

  it("should throw immediately for NaN duration", ({ expect }) => {
    expect(() => delay(NaN, { mode: "resolve" })).toThrow(
      "Invalid duration NaN"
    );
  });

  it("should resolve with undefined after a positive duration with default configuration", async ({
    expect,
  }) => {
    const result = await delay(100);
    expect(result).toBeUndefined();
  });

  it("should reject with a custom error message after a positive duration in reject mode", async ({
    expect,
  }) => {
    expect(delay(100, { mode: "reject" })).rejects.toThrow(
      "Rejected by delay function"
    );
  });
});
