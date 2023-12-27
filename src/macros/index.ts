import { RequiredDeep, ExtractArgs, GenericRecord } from "../types";

export function defineArgs<T extends GenericRecord | undefined>(
  input: T,
  required: ExtractArgs<T>
): RequiredDeep<NonNullable<T>> {
  throw Error("missing implementation");
}
