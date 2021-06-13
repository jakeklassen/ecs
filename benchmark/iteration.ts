import Benchmark, { Event } from 'benchmark';

// tslint:disable: no-console

const NUM_ELEMENTS = 100_000;

const plainArray = Array.from({ length: NUM_ELEMENTS }, (_, n) => n);
const objectArray = Array.from({ length: NUM_ELEMENTS }, (_, n) => ({
  key: n,
}));
const map = new Map(plainArray.map((n) => [n, n]));
const lookup: { [key: number]: number } = plainArray.reduce(
  (acc, n) => ({ ...acc, n }),
  {},
);

const suite = new Benchmark.Suite();

suite
  .add(`plain Array for loop @ ${NUM_ELEMENTS} elements`, () => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < plainArray.length; ++i) {
      // tslint:disable-next-line: no-unused-expression
      plainArray[i] & 0b0010;
    }
  })
  .add(`plain Array for-of loop @ ${NUM_ELEMENTS} elements`, () => {
    for (const n of plainArray) {
      // tslint:disable-next-line: no-unused-expression
      n & 0b0010;
    }
  })
  .add(`object Array for loop @ ${NUM_ELEMENTS} elements`, () => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < objectArray.length; ++i) {
      // tslint:disable-next-line: no-unused-expression
      objectArray[i].key & 0b0010;
    }
  })
  .add(`object Array for-of loop @ ${NUM_ELEMENTS} elements`, () => {
    // tslint:disable-next-line: prefer-for-of
    for (const pair of objectArray.entries()) {
      // tslint:disable-next-line: no-unused-expression
      pair[1].key & 0b0010;
    }
  })
  .add(`Map for-of loop Map#entries() @ ${NUM_ELEMENTS} elements`, () => {
    for (const [k, v] of map.entries()) {
      // tslint:disable-next-line: no-unused-expression
      v & 0b0010;
    }
  })
  .add(`Map#forEach @ ${NUM_ELEMENTS} elements`, () => {
    map.forEach((v) => v & 0b0010);
  })
  .add(`plain Array for loop with Map#get @ ${NUM_ELEMENTS} elements`, () => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < plainArray.length; ++i) {
      // tslint:disable-next-line: no-unused-expression
      map.get(plainArray[i])! & 0b0010;
    }
  })
  .add(
    `plain Array for loop with lookup Object @ ${NUM_ELEMENTS} elements`,
    () => {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < plainArray.length; ++i) {
        // tslint:disable-next-line: no-unused-expression
        lookup[plainArray[i]] & 0b0010;
      }
    },
  )
  .add(
    `plain Array for-of loop with lookup Object @ ${NUM_ELEMENTS} elements`,
    () => {
      for (const i of plainArray) {
        // tslint:disable-next-line: no-unused-expression
        lookup[i] & 0b0010;
      }
    },
  )
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
