export type Nothing = { kind: "nothing" };

let _nothing: undefined | Nothing;
export const Nothing = () =>
  _nothing !== undefined ? _nothing : (_nothing = { kind: "nothing" });
