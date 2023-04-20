/**
 * Returns a random index within the range of the given array.
 * @param {any[]} arr - The array to pick a random index from.
 * @returns {number} A random index within the range of the array.
 * 
 * @author Daniel Montilla
 */
export function pickRandomIndex(arr: any[]): number {
  return Math.floor(Math.random() * arr.length);
}

/**
 * Returns a random element from the given array.
 * @param {T[]} arr - The array to pick a random element from.
 * @returns {T} A random element from the array.
 * @template T
 * 
 * @author Daniel Montilla
 */
export function pickRandomElement<T>(arr: T[]): T {
  return arr[pickRandomIndex(arr)];
}

/**
 * @description checks if `arr` only contain unique values
 * @returns {boolean} `true` if `arr`'s values are all diferent otherwise `false` 
 */
export const onlyUniques = <T>(arr: Array<T>): boolean => {
  const set = new Set<T>();

  for (const value of arr) {
    if (set.has(value)) return false;
    set.add(value);
  }

  return true;
}