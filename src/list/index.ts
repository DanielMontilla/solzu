import { Option } from "../option";

export class List<T> {
  [index: number]: Option<T>;

  private constructor(private _array: Array<T>) {}

  public get(index: number): Option<T> {
    return Option.FromNullable(this._array[index]);
  }

  public static FromArray<T>(array: Array<T>) {
    return proxy(new List(array));
  }
}

const proxy = <T>(instance: List<T>): List<T> => {
  return new Proxy(instance, {
    get(self, property) {
      console.log("hi", typeof property);
      if (typeof property === "number") {
        console.log("inside");
        return self.get(property);
      }

      return self[property as keyof typeof self];
    },
  });
};
