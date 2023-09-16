export class Cancelation {}

export class Future<
  V,
  E = Error,
  C = Cancelation,
  CompleteReturn = void,
  FailedReturn = void,
  CancelReturn = void,
> {
  public onComplete?: (result: V) => CompleteReturn;
  public onFailed?: (error: E) => FailedReturn;
  public onCanceled?: (reason: C) => CancelReturn;
}

