import { Maybe } from "../..";

export const someInner: string = "some";
export type SomeInner = typeof someInner;
export const some = Maybe.Some(someInner);

export const none = Maybe.None();

export const someMaybe = Maybe.Some(someInner).toBase();
export const noneMaybe = Maybe.None().populate<SomeInner>().toBase();
export const maybe = someMaybe;
