import { describe, expect, expectTypeOf, it, vitest } from "vitest";
import { State } from "../state";
import { Watcher } from "../watcher";
import { Maybe, None, Some } from "../../maybe";

describe("Watcher.Mono [runtime]", () => {
  it("should trigger callback with initial state when 'immediate' option is true", () => {
    const value = 0x0;

    const state = State(value);
    const callback = vitest.fn();

    Watcher.Mono(state, callback, { immediate: true });

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith({ previous: None(), current: value });
  });

  it("should not trigger callback initially when 'immediate' option is false", () => {
    const value = "test";

    const state = State(value);
    const callback = vitest.fn();

    Watcher.Mono(state, callback, { immediate: false });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should trigger callback with updated state on state change", () => {
    const first = 10;
    const next = 5;

    const state = State(first);
    const callback = vitest.fn();

    const watcher = Watcher.Mono(state, callback, { immediate: false });
    state.value = next;

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith({ previous: Some(first), current: next });

    watcher.dispose();
  });

  it("should stop triggering callback after dispose is called", () => {
    const state = State(10);
    const callback = vitest.fn();

    const watcher = Watcher.Mono(state, callback, { immediate: false });
    watcher.dispose();
    state.value = 20;

    expect(callback).not.toHaveBeenCalled();
  });
});

describe("Watcher.Mono [types]", () => {
  it("should correctly type the callback parameters with known state type", () => {
    const state = State(10);

    Watcher.Mono(state, ({ previous, current }) => {
      type TestPrevious = typeof previous;
      type ExpectedPrevious = Maybe<number>;
      expectTypeOf<TestPrevious>().toMatchTypeOf<ExpectedPrevious>();

      type TestCurrent = typeof current;
      type ExpectedCurrent = number;
      expectTypeOf<TestCurrent>().toMatchTypeOf<ExpectedCurrent>();
    });
  });

  it("should correctly type the callback parameters with unknown state type", () => {
    const state = State<unknown>(10);

    Watcher.Mono(state, ({ previous, current }) => {
      type TestPrevious = typeof previous;
      type ExpectedPrevious = Maybe<unknown>;
      expectTypeOf<TestPrevious>().toMatchTypeOf<ExpectedPrevious>();

      type TestCurrent = typeof current;
      type ExpectedCurrent = unknown;
      expectTypeOf<TestCurrent>().toMatchTypeOf<ExpectedCurrent>();
    });
  });

  it("should correctly type the callback parameters with a complex state type", () => {
    const state = State<{ foo: string; bar: number }>({ foo: "test", bar: 42 });

    Watcher.Mono(state, ({ previous, current }) => {
      type TestPrevious = typeof previous;
      type ExpectedPrevious = Maybe<{ foo: string; bar: number }>;
      expectTypeOf<TestPrevious>().toMatchTypeOf<ExpectedPrevious>();

      type TestCurrent = typeof current;
      type ExpectedCurrent = { foo: string; bar: number };
      expectTypeOf<TestCurrent>().toMatchTypeOf<ExpectedCurrent>();
    });
  });
});
