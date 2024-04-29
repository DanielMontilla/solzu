export const isFunction = (
  maybeFunction: any | ((...args: any[]) => void)
): maybeFunction is (...args: any[]) => void =>
  typeof maybeFunction === "function";
