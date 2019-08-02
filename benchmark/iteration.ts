import Benchmark, { Event } from 'benchmark';

// tslint:disable: no-console

const NUM_ELEMENTS = 100_000;

const collection = Array.from({ length: NUM_ELEMENTS }, (_, n) => n);
const map = new Map(collection.map(n => [n, n]));
const lookup: { [key: number]: number } = collection.reduce(
  (acc, n) => ({ ...acc, n }),
  {},
);

const suite = new Benchmark.Suite();

suite
  .add(`Array for @ ${NUM_ELEMENTS} elements`, () => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < collection.length; ++i) {
      // tslint:disable-next-line: no-unused-expression
      collection[i] & 0b0010;
    }
  })
  .add(`Array for-of @ ${NUM_ELEMENTS} elements`, () => {
    for (const n of collection) {
      // tslint:disable-next-line: no-unused-expression
      n & 0b0010;
    }
  })
  .add(`Map for-of entries() @ ${NUM_ELEMENTS} elements`, () => {
    for (const [k, v] of map.entries()) {
      // tslint:disable-next-line: no-unused-expression
      v & 0b0010;
    }
  })
  .add(`Map#forEach @ ${NUM_ELEMENTS} elements`, () => {
    map.forEach(v => v & 0b0010);
  })
  .add(`Array for with Map#get @ ${NUM_ELEMENTS} elements`, () => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < collection.length; ++i) {
      // tslint:disable-next-line: no-unused-expression
      map.get(collection[i])! & 0b0010;
    }
  })
  .add(`Array for with lookup Object @ ${NUM_ELEMENTS} elements`, () => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < collection.length; ++i) {
      // tslint:disable-next-line: no-unused-expression
      lookup[collection[i]] & 0b0010;
    }
  })
  .add(`Array for-of with lookup Object @ ${NUM_ELEMENTS} elements`, () => {
    for (const i of collection) {
      // tslint:disable-next-line: no-unused-expression
      lookup[i] & 0b0010;
    }
  })
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
