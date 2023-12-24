import { describe, it } from "vitest";
import { delay } from ".";

describe.concurrent("delay function", () => {
  it("should resolve to undefined after the specified time (void case)", async ({ expect }) => {
    const start = Date.now();
    await delay(500);
    const end = Date.now();
    const elapsed = end - start;
    expect(elapsed).toBeGreaterThanOrEqual(500);
  });

  it("should resolve to the given value after the specified time (value case)", async ({
    expect,
  }) => {
    const value = "test value";
    const start = Date.now();
    const result = await delay(500, value);
    const end = Date.now();
    const elapsed = end - start;
    expect(elapsed).toBeGreaterThanOrEqual(500);
    expect(result).toBe(value);
  });

  it("should throw an error for invalid ms values (NaN, negative, zero)", async ({
    expect,
  }) => {
    const invalidDurations = [NaN, 0, -1];

    for (const duration of invalidDurations) {
      expect(() => delay(duration)).toThrow(`Invalid duration ${duration}`);
    }
  });
});
