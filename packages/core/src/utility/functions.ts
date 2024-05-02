export function isFunction<T extends (...args: any[]) => any>(
  maybeFunction: any | T
): maybeFunction is T {
  return typeof maybeFunction === "function";
}
