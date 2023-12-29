import {
  isArray,
  isEmptyArray,
  isNotEmptyArray,
  isMap,
  isEmptyMap,
  isNotEmptyMap,
  isSet,
  isEmptySet,
  isNotEmptySet,
} from "../../..";

/**
 * Checks if the given collection is empty.
 * This function supports Maps, Sets, and Arrays.
 * @param {Map<any, any> | Set<any> | Array<any>} collection - The collection to check.
 * @returns {boolean} True if the collection is empty, false otherwise.
 * @throws {Error} If the collection type is unsupported.
 */

/**
 * Checks if map is empty. Uses `isEmptyMap` under the hood.
 * @overload
 * @param {Map<any, any>} map - The map to check.
 * @returns {boolean} True if the map is empty, false otherwise.
 */
export function isEmpty(map: Map<any, any>): boolean;

/**
 * Checks if set is empty. Uses `isEmptySet` under the hood.
 * @overload
 * @param {Set<any>} set - The set to check.
 * @returns {boolean} True if the set is empty, false otherwise.
 */
export function isEmpty(set: Set<any>): boolean;

/**
 * Checks if array is empty. Uses `isEmptyArray` under the hood.
 * @overload
 * @param {Array<any>} array - The array to check.
 * @returns {boolean} True if the array is empty, false otherwise.
 */
export function isEmpty(array: Array<any>): boolean;

export function isEmpty(collection: Map<any, any> | Set<any> | Array<any>) {
  if (isArray(collection)) return isEmptyArray(collection);
  if (isMap(collection)) return isEmptyMap(collection);
  if (isSet(collection)) return isEmptySet(collection);
  throw new Error("Unsupported type for isEmpty");
}

/**
 * Checks if the given collection is not empty.
 * This function supports Maps, Sets, and Arrays.
 * @param {Map<any, any> | Set<any> | Array<any>} collection - The collection to check.
 * @returns {boolean} True if the collection is not empty, false otherwise.
 * @throws {Error} If the collection type is unsupported.
 */

/**
 * Checks if map is not empty. Uses `isNotEmptyMap` under the hood.
 * @overload
 * @param {Map<any, any>} map - The map to check.
 * @returns {boolean} True if the map is not empty, false otherwise.
 */
export function isNotEmpty(map: Map<any, any>): boolean;

/**
 * Checks if set is not empty. Uses `isNotEmptySet` under the hood.
 * @overload
 * @param {Set<any>} set - The set to check.
 * @returns {boolean} True if the set is not empty, false otherwise.
 */
export function isNotEmpty(set: Set<any>): boolean;

/**
 * Checks if array is not empty. Uses `isNotEmptyArray` under the hood.
 * @overload
 * @param {Array<any>} array - The array to check.
 * @returns {boolean} True if the array is not empty, false otherwise.
 */
export function isNotEmpty(array: Array<any>): boolean;

export function isNotEmpty(
  collection: Array<any> | Map<any, any> | Set<any>
): boolean {
  if (isArray(collection)) return isNotEmptyArray(collection);
  if (isMap(collection)) return isNotEmptyMap(collection);
  if (isSet(collection)) return isNotEmptySet(collection);
  throw new Error("Unsupported type for isNotEmpty");
}
