// import { describe, it, expect } from "vitest";
// import {
//   Err,
//   Ok,
//   nextFloat,
//   nextIndex,
//   nextIndexU,
//   nextInt,
//   nextKey,
// } from "../..";

// describe("nextFloat", () => {
//   it("generates a random floating-point number between 0 (inclusive) and 1 (exclusive)", () => {
//     const iterations = 1_000;
//     for (let _ = 0; _ < iterations; _++) {
//       const num = nextFloat();
//       expect(num).toBeGreaterThanOrEqual(0);
//       expect(num).toBeLessThan(1);
//     }
//   });

//   it("generates a random floating-point number between 0 and 1 with flat distribution", () => {
//     const iterations = 100_000;
//     const buckets = new Array(10).fill(0); // Create 10 buckets for [0.0-0.1), [0.1-0.2), ..., [0.9-1.0)
//     const tolerance = 0.05;
//     const expectedPerBucket = iterations / buckets.length;

//     for (let _ = 0; _ < iterations; _++) {
//       const num = nextFloat();
//       const bucketIndex = Math.floor(num * 10); // Determine which bucket the number falls into
//       buckets[bucketIndex]++;
//     }

//     buckets.forEach(count => {
//       expect(count).toBeGreaterThanOrEqual(expectedPerBucket * (1 - tolerance));
//       expect(count).toBeLessThanOrEqual(expectedPerBucket * (1 + tolerance));
//     });
//   });
// });

// describe("between", () => {
//   it("generates a random number within the specified range", () => {
//     const result = nextFloat.between(1, 10);
//     expect(result).toBeInstanceOf(Ok);
//     const num = result.takeOk();
//     expect(num).toBeGreaterThanOrEqual(1);
//     expect(num).toBeLessThanOrEqual(10);
//   });

//   it("generates a random number within the specified range with flat distribution", () => {
//     const min = 1;
//     const max = 5;
//     const iterations = 100_000;
//     const bucketCount = 10;
//     const buckets = new Array(bucketCount).fill(0);
//     const tolerance = 0.05;
//     const expectedPerBucket = iterations / bucketCount;

//     for (let i = 0; i < iterations; i++) {
//       const result = nextFloat.between(min, max);
//       expect(result).toBeInstanceOf(Ok);
//       const num = result.takeOk();
//       const bucketIndex = Math.floor(((num - min) / (max - min)) * bucketCount);
//       buckets[bucketIndex]++;
//     }

//     buckets.forEach((count, index) => {
//       expect(count).toBeGreaterThanOrEqual(expectedPerBucket * (1 - tolerance));
//       expect(count).toBeLessThanOrEqual(expectedPerBucket * (1 + tolerance));
//     });
//   });

//   it("should always return value if min === max (integers)", () => {
//     const iterations = 1_000;

//     for (let i = 0; i < iterations; i++) {
//       const result = nextFloat.between(i, i);
//       expect(result).toBeInstanceOf(Ok);
//       const num = result.takeOk();
//       expect(num).toBe(i);
//     }
//   });

//   it("should always return value if min === max (floats)", () => {
//     const iterations = 10;

//     const icrements = 1 / iterations;
//     let value = 0;
//     for (let i = 0; i < iterations; i++) {
//       const result = nextFloat.between(value, value);
//       expect(result).toBeInstanceOf(Ok);
//       const num = result.takeOk();
//       expect(num).toBe(value);
//       value += icrements;
//     }
//   });

//   it("returns an error for invalid range", () => {
//     const result = nextFloat.between(10, 1);
//     expect(result).toBeInstanceOf(Err);
//     expect(result.takeErr()).toBe(nextFloat.between.error.InvalidRange);
//   });

//   it("returns an error for non-numeric inputs", () => {
//     // @ts-expect-error
//     const result1 = nextFloat.between("a", "b");
//     expect(result1).toBeInstanceOf(Err);
//     expect(result1.takeErr()).toBe(nextFloat.between.error.InvalidInput);

//     const result2 = nextFloat.between(NaN, 10);
//     expect(result2).toBeInstanceOf(Err);
//     expect(result2.takeErr()).toBe(nextFloat.between.error.InvalidInput);

//     const result3 = nextFloat.between(-1000, NaN);
//     expect(result3).toBeInstanceOf(Err);
//     expect(result3.takeErr()).toBe(nextFloat.between.error.InvalidInput);
//   });

//   describe("betweenU", () => {
//     it("generates a random number within the specified range without validation", () => {
//       const num = nextFloat.betweenU(1, 10);
//       expect(num).toBeGreaterThanOrEqual(1);
//       expect(num).toBeLessThanOrEqual(10);
//     });

//     it("generates a random number within the specified range with flat distribution", () => {
//       const min = 1;
//       const max = 5;
//       const iterations = 100_000;
//       const bucketCount = 10;
//       const buckets = new Array(bucketCount).fill(0);
//       const tolerance = 0.05;
//       const expectedPerBucket = iterations / bucketCount;

//       for (let i = 0; i < iterations; i++) {
//         const num = nextFloat.betweenU(min, max);
//         const bucketIndex = Math.floor(
//           ((num - min) / (max - min)) * bucketCount
//         );
//         buckets[bucketIndex]++;
//       }

//       buckets.forEach(count => {
//         expect(count).toBeGreaterThanOrEqual(
//           expectedPerBucket * (1 - tolerance)
//         );
//         expect(count).toBeLessThanOrEqual(expectedPerBucket * (1 + tolerance));
//       });
//     });

//     it("should always return value if min === max (integers)", () => {
//       const iterations = 1_000;

//       for (let i = 0; i < iterations; i++) {
//         const num = nextFloat.betweenU(i, i);
//         expect(num).toBe(i);
//       }
//     });

//     it("should always return value if min === max (floats)", () => {
//       const iterations = 10;

//       const icrements = 1 / iterations;
//       let value = 0;
//       for (let i = 0; i < iterations; i++) {
//         const num = nextFloat.betweenU(value, value);
//         expect(num).toBe(value);
//         value += icrements;
//       }
//     });
//   });
// });

// describe("nextInt", () => {
//   it("@overload generates a random integer between 0 and 1 when no upper bound is provided", () => {
//     const iterations = 10000;
//     let count0 = 0;
//     let count1 = 0;

//     for (let i = 0; i < iterations; i++) {
//       const num = nextInt();
//       if (num === 0) count0++;
//       if (num === 1) count1++;
//     }

//     expect(count0).toBeGreaterThan(0);
//     expect(count1).toBeGreaterThan(0);
//     expect(count0 + count1).toBe(iterations);
//   });

//   it("@overload generates a random integer between 0 and upperBound (inclusive)", () => {
//     const upperBound = 5;
//     const iterations = 100_000;
//     const tolerance = 0.05;
//     const expectedPerBucket = iterations / (upperBound + 1);
//     const buckets = new Map<number, number>();

//     for (let _ = 0; _ <= upperBound; _++) {
//       buckets.set(_, 0);
//     }

//     for (let _ = 0; _ < iterations; _++) {
//       const num = nextInt(upperBound);
//       buckets.set(num, (buckets.get(num) || 0) + 1);
//     }

//     buckets.forEach(count => {
//       expect(count).toBeGreaterThanOrEqual(expectedPerBucket * (1 - tolerance));
//       expect(count).toBeLessThanOrEqual(expectedPerBucket * (1 + tolerance));
//     });
//   });

//   describe("between", () => {
//     it("returns a random integer within the specified range", () => {
//       const min = 1;
//       const max = 5;
//       const iterations = 1000;

//       for (let i = 0; i < iterations; i++) {
//         const result = nextInt.between(min, max);
//         expect(result).toBeInstanceOf(Ok);
//         const num = result.takeOk();
//         expect(Number.isInteger(num)).toBe(true);
//         expect(num).toBeGreaterThanOrEqual(min);
//         expect(num).toBeLessThanOrEqual(max);
//       }
//     });

//     it("returns InvalidInput error for non-integer inputs", () => {
//       const result1 = nextInt.between(1.5, 5);
//       expect(result1).toBeInstanceOf(Err);
//       expect(result1.takeErr()).toBe(nextInt.between.error.InvalidInput);

//       const result2 = nextInt.between(1, 5.5);
//       expect(result2).toBeInstanceOf(Err);
//       expect(result2.takeErr()).toBe(nextInt.between.error.InvalidInput);
//     });

//     it("returns InvalidRange error for min greater than max", () => {
//       const result = nextInt.between(10, 5);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextInt.between.error.InvalidRange);
//     });
//   });

//   describe("betweenU", () => {
//     it("returns an integer within the specified range", () => {
//       const min = 1;
//       const max = 5;
//       const iterations = 1000;

//       for (let i = 0; i < iterations; i++) {
//         const num = nextInt.betweenU(min, max);
//         expect(Number.isInteger(num)).toBe(true);
//         expect(num).toBeGreaterThanOrEqual(min);
//         expect(num).toBeLessThanOrEqual(max);
//       }
//     });

//     it("generates a random integer within the specified range with flat distribution", () => {
//       const min = 1;
//       const max = 5;
//       const iterations = 100_000;
//       const buckets = new Map<number, number>();
//       const tolerance = 0.05; // Allow 5% variation
//       const expectedPerBucket = iterations / (max - min + 1);

//       for (let i = min; i <= max; i++) {
//         buckets.set(i, 0);
//       }

//       for (let i = 0; i < iterations; i++) {
//         const num = nextInt.betweenU(min, max);
//         buckets.set(num, (buckets.get(num) || 0) + 1);
//       }

//       buckets.forEach((count, number) => {
//         expect(count).toBeGreaterThanOrEqual(
//           expectedPerBucket * (1 - tolerance)
//         );
//         expect(count).toBeLessThanOrEqual(expectedPerBucket * (1 + tolerance));
//       });
//     });
//   });
// });

// describe("nextIndex", () => {
//   it("returns an error when the array is empty", () => {
//     const result = nextIndex([]);
//     expect(result).toBeInstanceOf(Err);
//     expect(result.takeErr()).toBe(nextIndex.error.EmptyArray);
//   });

//   it("returns a valid index for a non-empty array", () => {
//     const array = [10, 20, 30];
//     const result = nextIndex(array);
//     expect(result).toBeInstanceOf(Ok);
//     expect(result.takeOk()).toBeGreaterThanOrEqual(0);
//     expect(result.takeOk()).toBeLessThan(array.length);
//   });
// });

// describe("nextIndexU", () => {
//   it("generates a random index within the array bounds", () => {
//     const array = [10, 20, 30, 40, 50];
//     const iterations = 100_000;
//     const tolerance = 0.05;
//     const expectedPerBucket = iterations / array.length;
//     const buckets = new Map<number, number>();

//     for (let i = 0; i < array.length; i++) {
//       buckets.set(i, 0);
//     }

//     for (let i = 0; i < iterations; i++) {
//       const index = nextIndexU(array);
//       buckets.set(index, (buckets.get(index) || 0) + 1);
//     }

//     buckets.forEach(count => {
//       expect(count).toBeGreaterThanOrEqual(expectedPerBucket * (1 - tolerance));
//       expect(count).toBeLessThanOrEqual(expectedPerBucket * (1 + tolerance));
//     });
//   });
// });

// describe("nextKey", () => {
//   describe("@overload for Record", () => {
//     it("should return a valid key for a non-empty record", () => {
//       const record = { a: 1, b: 2, c: 3 };
//       const result = nextKey(record);
//       expect(result).toBeInstanceOf(Ok);
//       expect(Object.keys(record)).toContain(result.takeOk());
//     });

//     it("should return an error for an empty record", () => {
//       const record = {};
//       const result = nextKey(record);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofRecord.error.IsEmpty);
//     });
//   });

//   describe("@overload for Map", () => {
//     it("should return a valid key for a non-empty map", () => {
//       const map = new Map([
//         ["a", 1],
//         ["b", 2],
//       ]);
//       const result = nextKey(map);
//       expect(result).toBeInstanceOf(Ok);
//       expect([...map.keys()]).toContain(result.takeOk());
//     });

//     it("should return an error for an empty map", () => {
//       const map = new Map();
//       const result = nextKey(map);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofMap.error.IsEmpty);
//     });
//   });

//   describe("@overload for Set", () => {
//     it("should return a valid element for a non-empty set", () => {
//       const set = new Set([1, 2, 3]);
//       const result = nextKey(set);
//       expect(result).toBeInstanceOf(Ok);
//       expect([...set]).toContain(result.takeOk());
//     });

//     it("should return an error for an empty set", () => {
//       const set = new Set();
//       const result = nextKey(set);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofSet.error.IsEmpty);
//     });
//   });

//   describe("@overload for Array", () => {
//     it("should return a valid index for a non-empty array", () => {
//       const array = [10, 20, 30];
//       const result = nextKey(array);
//       expect(result).toBeInstanceOf(Ok);
//       expect(result.takeOk()).toBeGreaterThanOrEqual(0);
//       expect(result.takeOk()).toBeLessThan(array.length);
//     });

//     it("should return an error for an empty array", () => {
//       const array = [];
//       const result = nextKey(array);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofArray.error.IsEmpty);
//     });
//   });
//   describe("ofRecord", () => {
//     it("returns an error for an empty record", () => {
//       const result = nextKey.ofRecord({});
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofRecord.error.IsEmpty);
//     });

//     it("returns an error for non-records", () => {
//       // @ts-expect-error
//       const result = nextKey.ofRecord(null);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofRecord.error.NotARecord);
//     });

//     it("returns a valid key for a non-empty record", () => {
//       const record = { a: 1, b: 2, c: 3 };
//       const result = nextKey.ofRecord(record);
//       expect(result).toBeInstanceOf(Ok);
//       expect(Object.keys(record)).toContain(result.takeOk());
//     });
//   });

//   describe("ofArray", () => {
//     it("returns an error for an empty array", () => {
//       const result = nextKey.ofArray([]);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofArray.error.IsEmpty);
//     });

//     it("returns an error for non-arrays", () => {
//       // @ts-expect-error
//       const result = nextKey.ofArray(null);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofArray.error.NotAnArray);
//     });

//     it("returns a valid index for a non-empty array", () => {
//       const array = [10, 20, 30];
//       const iterations = 1000;

//       for (let _ = 0; _ < iterations; _++) {
//         const result = nextKey.ofArray(array);
//         expect(result).toBeInstanceOf(Ok);
//         expect(result.takeOk()).toBeGreaterThanOrEqual(0);
//         expect(result.takeOk()).toBeLessThan(array.length);
//       }
//     });
//   });

//   describe("ofMap", () => {
//     it("returns an error for an empty map", () => {
//       const map = new Map();
//       const result = nextKey.ofMap(map);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofMap.error.IsEmpty);
//     });

//     it("returns an error for non-maps", () => {
//       // @ts-expect-error
//       const result = nextKey.ofMap(null);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofMap.error.NotAMap);
//     });

//     it("returns a valid key for a non-empty map", () => {
//       const map = new Map([
//         ["a", 1],
//         ["b", 2],
//       ]);
//       const result = nextKey.ofMap(map);
//       expect(result).toBeInstanceOf(Ok);
//       expect([...map.keys()]).toContain(result.takeOk());
//     });
//   });

//   describe("ofSet", () => {
//     it("returns an error for an empty set", () => {
//       const set = new Set();
//       const result = nextKey.ofSet(set);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofSet.error.IsEmpty);
//     });

//     it("returns an error for non-sets", () => {
//       // @ts-expect-error
//       const result = nextKey.ofSet(null);
//       expect(result).toBeInstanceOf(Err);
//       expect(result.takeErr()).toBe(nextKey.ofSet.error.NotASet);
//     });

//     it("returns a valid element for a non-empty set", () => {
//       const set = new Set([1, 2, 3]);
//       const result = nextKey.ofSet(set);
//       expect(result).toBeInstanceOf(Ok);
//       expect([...set]).toContain(result.takeOk());
//     });
//   });
// });
