import './definitions';
import { defineGlobals } from "../helper";

defineGlobals([
  {
    key: 'pickRandom',
    value: <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
  }
]);