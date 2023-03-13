import './definitions';
import { defineGlobals } from "../helper";

defineGlobals([
  {
    key: 'mapValue',
    value: (
      value: number,
      { min: a1, max: a2 }: IntervalRange,
      { min: b1, max: b2 }: IntervalRange
    ) => b1 + (((value - a1)*(b2 - b1)) / (a2 - a1))
  },
  {
    key: 'randomFloat',
    value: (
      range: IntervalRange = { min: 0, max: 1 }
    ) => mapValue(Math.random(), { min: 0, max: 1 }, range)
  }
]);