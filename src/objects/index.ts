import './definitions';
import { defineGlobals } from "../helper";

defineGlobals([
  {
    key: 'defineOptions',
    value: <T extends Object> (
      options: Partial<T> | undefined,
      def: T
    ): T => {
      if (!options) return def;
      let res: T = {...options} as T;
      for (const key in def) {
        if (Object.prototype.hasOwnProperty.call(def, key)) {
          const objectKey = key as keyof T;
          if (!(objectKey in options)) res[objectKey] = def[key];
        }
      }
      return res;
    }
  },
  {
    key: 'NOOP',
    value: () => {}
  }
])