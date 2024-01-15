import { Result } from "../..";

export const CustomErrorLookup = {
  A: "Error A",
  B: "Error B",
  C: "Error C",
} as const;

export enum CustomErrorEnum {
  A,
  B,
  C,
}

export type CustomError = keyof typeof CustomErrorLookup;

export const okInner: number = 0;
export type OkInner = typeof okInner;

export const errInner: CustomError = "A" as CustomError;
export type ErrInner = CustomError;

export const okResult: Result<OkInner, ErrInner> = Result.Ok(okInner).toBase();
export const errResult: Result<OkInner, ErrInner> =
  Result.Err(errInner).toBase();
export const result = okResult;

export type ResultTest = typeof result;

export const ok = Result.Ok(okInner);
export type OkTest = typeof ok;

export const err = Result.Err(errInner);
export type ErrTest = typeof err;
