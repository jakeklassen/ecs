import Benchmark, { Event } from 'benchmark';
import { BitSet } from 'bitset';

// tslint:disable: no-console

const NUM_FLAGS = 100_000;

function* bitmaskGenerator() {
  let n = 0;

  while (true) {
    const mask = new BitSet(0);
    mask.set(n);
    ++n;

    yield mask;
  }
}

const genny = bitmaskGenerator();
const [bs1, bs2] = Array.from({ length: NUM_FLAGS }, () => 0)
  .map(() => genny.next().value)
  .reverse();

const suite = new Benchmark.Suite();

suite
  .add('BitSet.toString(2)', () => {
    bs1.toString(2);
  })
  .add('BitSet.toArray', () => {
    bs1.toArray();
  })
  .add('BitSet |', () => {
    bs1.or(bs2);
  })
  .add('BitSet &', () => {
    bs1.and(bs2);
  })
  .add('BitSet.equals()', () => {
    bs1.equals(bs2);
  })
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
