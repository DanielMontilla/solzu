import { describe, it } from "vitest";
import { Result } from '.';
import { expect } from "vitest";

const ok = <V, E = void>(value: V): Result<V, E> => Result.Ok(value);
const err = <E, V = void>(error: E): Result<V, E> => Result.Err(error);

describe("Result Tests!", () => {

  it("#1", () => {
    const res1 = ok(10);

    if (res1.isErr()) {
      res1.error
    }
  });

});