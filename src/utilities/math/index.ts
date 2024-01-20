import { Result } from "../..";
import { defineEnum } from "../macros";

export function lerp(
  min: number,
  max: number,
  factor: number
): Result<number, lerp.Error> {
  return Result.Ok()
    .check(_ => min <= max, lerp.Error.InvalidRange)
    .check(_ => factor >= 0 && factor <= 1, lerp.Error.InvalidFactor)
    .map(_ => lerp.unsafe(min, max, factor));
}

export namespace lerp {
  export type Error = (typeof Error)[keyof typeof Error];
  export const Error = defineEnum(
    ["InvalidRange", "InvalidFactor"] as const,
    "lerp"
  );

  export function unsafe(min: number, max: number, factor: number): number {
    return min + factor * (max - min);
  }
}
