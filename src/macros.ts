import { entries } from "./objects";
import { RequiredOptional } from "./types";

export function defineArgs<
  P extends Record<string | number | symbol, any>,
> (
  partial: P | undefined,
  required: RequiredOptional<P>
): Required<P> {
  let res: Record<string | number | symbol, any> = { ...partial };

  for (const [key, value] of entries(required)) {
    if (!(key in res)) {
      res[key] = value;
    }
  }

  return res as unknown as Required<P>;
}
