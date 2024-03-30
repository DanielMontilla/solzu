export const VOID = null as unknown as void;
export const NEVER = null as unknown as never;
export const EMPTY = VOID;

export type Empty = void;

// TODO: MOVE
// export type Nothing = { kind: "nothing" };
// export const NOTHING: Nothing = { kind: "nothing" };
// export const nothing = () => NOTHING;

export const NOOF = () => {};
