import { describe, it, expect } from "vitest";
import {
  isMaybe,
  isNone,
  isSome,
  Maybe,
  None,
  NONE_CLASSIFIER,
  NONE_SPECIFIER,
  Some,
  SOME_CLASSIFIER,
  SOME_SPECIFIER,
} from ".";
import { flatten, map, MAX_FLATTEN_DEPTH, or, take, TakeError } from "./scoped";
import { Nothing } from "../nothing";
import { $CLASSIFIER, $SPECIFIER } from "../data";
import { job } from "../job";

describe("Some", () => {
  it("should match its runtime specifier w/ explicit specifier", () => {
    const value = Some("test");

    expect(value).toHaveProperty($SPECIFIER, SOME_SPECIFIER);
  });

  it("should match its runtime classifier w/ explicit classifier", () => {
    const value = Some("test");

    expect(value).toHaveProperty($CLASSIFIER, SOME_CLASSIFIER);
  });
  it("should return an empty some when no argument is provided", () => {
    const value = Some();

    expect(value).toHaveProperty("value", Nothing());
  });

  it("should return a Some with inner value when argument is provided", () => {
    const inner = "test";
    const value = Some(inner);

    expect(value).toHaveProperty("value", inner);
  });
});

describe("None", () => {
  it("should return None", () => {
    const value = None();

    expect(value).toHaveProperty("kind", "none");
  });

  it("should be identical to other None instances", () => {
    const a = None();
    const b = None();

    expect(a).toBe(b);
  });

  it("should match its runtime specifier w/ explicit specifier", () => {
    const value = None();

    expect(value).toHaveProperty($SPECIFIER, NONE_SPECIFIER);
  });

  it("should match its runtime classifier w/ explicit classifier", () => {
    const value = None();

    expect(value).toHaveProperty($CLASSIFIER, NONE_CLASSIFIER);
  });
});

describe("Maybe", () => {
  it("should return None when no argument is provided", () => {
    const value = Maybe();

    expect(value).toHaveProperty("kind", "none");
  });

  it("should return Some when argument is provided", () => {
    const inner = 0xf;
    const value = Maybe(inner);

    expect(value).toHaveProperty("kind", "some");
    expect(value).toHaveProperty("value", inner);
  });
});

describe("isSome", () => {
  it("should return true when Some is passed in", () => {
    const some = Some();
    const value = isSome(some);

    expect(value).toBe(true);
  });

  it("should return false when None is passed in", () => {
    const none = None();
    const value = isSome(none);

    expect(value).toBe(false);
  });
});

describe("isNone", () => {
  it("should return true when None is passed in", () => {
    const none = None();
    const value = isNone(none);

    expect(value).toBe(true);
  });

  it("should return false when Some is passed in", () => {
    const some = Some();
    const value = isNone(some);

    expect(value).toBe(false);
  });
});

describe("isMaybe", () => {
  it("should return true when Some value is passed in", () => {
    const some = Some();
    const value = isMaybe(some);

    expect(value).toBe(true);
  });

  it("should return true when None value is passed in", () => {
    const none = None();
    const value = isMaybe(none);

    expect(value).toBe(true);
  });

  it("should return false for an arbitrary object", () => {
    const maybe = { prop1: "hi", prop2: 10, prop3: true };
    const value = isMaybe(maybe);

    expect(value).toBe(false);
  });

  it("should return false for an object mimicking Maybe without correct symbols", () => {
    const maybe = {
      [$SPECIFIER]: "some",
      [$CLASSIFIER]: Symbol("solzu:core@some"),
      value: 10,
    };
    const value = isMaybe(maybe);

    expect(value).toBe(false);
  });

  it("should return false for null", () => {
    const maybe = null;
    const value = isMaybe(maybe);

    expect(value).toBe(false);
  });

  it("should return false for undefined", () => {
    const maybe = undefined;
    const value = isMaybe(maybe);

    expect(value).toBe(false);
  });
});

describe("map", () => {
  it("should return mapped maybe's inner some value for Some inputs", () => {
    const initial = 16;
    const final = initial * 2;
    const func = (x: number) => x * 2;
    const some = Some(initial);

    const value = map(func)(some);

    expect(isSome(value)).toBe(true);
    expect(value).toHaveProperty("value", final);
  });

  it("should return none for None inputs", () => {
    const none = None();
    const func = (x: number) => x * 2;

    const value = map(func)(none);

    expect(isNone(value)).toBe(true);
  });

  describe("w/ job", () => {
    it("should return mapped maybe's inner some value for Some inputs", () => {
      const initial = 16;
      const final = initial * 2;
      const func = (x: number) => x * 2;

      const value = job(Some(initial), map(func));

      expect(isSome(value)).toBe(true);
      expect(value).toHaveProperty("value", final);
    });

    it("should return none for None inputs", () => {
      const none = None();
      const func = (x: number) => x * 2;

      const value = job(none, map(func));

      expect(isNone(value)).toBe(true);
    });
  });
});

describe("take", () => {
  it("should extract inner value of some when provided with Some instance", () => {
    const inner = 10;
    const some = Some(inner);

    const value = take()(some);

    expect(value).toBe(inner);
  });

  it("should throw TakeError when provided with None instance", () => {
    const none = None();
    const callback = () => take()(none);

    expect(callback).toThrow(TakeError);
  });
});

describe("or", () => {
  it("should return the inner value when provided with Some instance", () => {
    const inner = "test";
    const some = Some(inner);

    const value = or("hello")(some);

    expect(value).toBe(inner);
  });

  it("should return the inner value when provided with Some instance", () => {
    const alteranative = "test";
    const none = None();

    const value = or(alteranative)(none);

    expect(value).toBe(alteranative);
  });
});

describe("flatten", () => {
  it("should return the original Some when provided with Some of depth 1", () => {
    const inner = 0xfafa;
    const some = Some(inner);

    const value = flatten()(some);

    expect(isSome(value)).toBe(true);
    expect(value).toHaveProperty("value", inner);
  });

  it("should return the flattened maybe when provided with Some of depth n <= MAX_FLATTEN_DEPTH", () => {
    const inner = "inner";
    const run = (n: number) => {
      let some: Maybe<any> = Some(inner);

      for (let i = 0; i < n; i++) {
        some = Some(some);
      }

      const value = flatten()(some);

      expect(isSome(value)).toBe(true);
      expect(value).toHaveProperty("value", inner);
    };

    for (let i = 1; i <= MAX_FLATTEN_DEPTH; i++) run(i);
  });

  it("should return the original None when provided with None", () => {
    const none = None();

    const value = flatten()(none);

    expect(isNone(value)).toBe(true);
  });

  it("should return None on nested maybe with ending None", () => {
    const maybe = Maybe(Maybe(Maybe(Maybe(None()))));

    const value = flatten()(maybe);

    expect(isNone(value)).toBe(true);
  });
});
