import { Option } from "../option";
import { isString } from "../string";

export class List<T> {
  [index: number]: Option<T>;

  private constructor(private _array: Array<T>) {
    return new Proxy(this, {
      get(self, property) {
        return Option.Of(property) // create property
          .check(isString) // check if its a string
          .mapSome(Number.parseInt) // if it is a string parse it into number
          .mapSome(index => self.get(index)) // if it was able to parse get the index
          .takeOr(() => self[property as keyof typeof self]); // if none just return normal property;
      },
    });
  }

  public get(index: number): Option<T> {
    return Option.FromNullable(this._array[index]);
  }

  public set(index: number, value: T) {}

  public static FromArray<T>(array: Array<T>) {
    return new List(array);
  }
}
