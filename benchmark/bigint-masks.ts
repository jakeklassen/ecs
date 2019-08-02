import Benchmark, { Event } from 'benchmark';
import { BitSet } from 'bitset';

// tslint:disable: no-console

const NUM_FLAGS = 100_000;

function* bitmaskGenerator() {
  let mask = 0b0001n;

  while (true) {
    // tslint:disable-next-line: no-bitwise
    mask = mask << 1n;
    yield mask;
  }
}

const genny = bitmaskGenerator();
const [huge1, huge2] = Array.from({ length: NUM_FLAGS }, () => 0)
  .map(() => genny.next().value)
  .reverse();

const bs1 = new BitSet(huge1.toString(2));
const bs2 = new BitSet(huge2.toString(2));

const suite = new Benchmark.Suite();

suite
  .add('BigInt |', () => {
    // tslint:disable-next-line: no-bitwise no-unused-expression
    huge1 | huge2;
  })
  .add('BigInt &', () => {
    // tslint:disable-next-line: no-bitwise no-unused-expression
    huge1 & huge2;
  })
  .add('BitSet |', () => {
    bs1.or(bs2);
  })
  .add('BitSet &', () => {
    bs1.and(bs2);
  })
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
