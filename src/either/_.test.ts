import { describe, it } from "vitest";
import { Either } from '.';
import { expect } from "vitest";

const left = <L, R>(value: L): Either<L, R> => Either.Left(value);
const right = <L, R>(value: R): Either<L, R> => Either.Right(value);

describe("Result Tests!", () => {

  it("#1", () => {
    const eit = left(10);
    expect(eit.isLeft()).toBe(true);
  });

});