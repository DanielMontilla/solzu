declare function defineOptions<T extends Object> (
  options: Partial<T> | undefined,
  def: T
): T;
declare function NOOP(...args: any[]): void;