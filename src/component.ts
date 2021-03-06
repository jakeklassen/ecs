import { BitSet } from './bitset.js';
import { Constructor } from './world.js';

function* bitmaskGenerator(): IterableIterator<BitSet> {
  let n = 1;

  while (true) {
    const mask = new BitSet(n);
    mask.set(n - 1);
    ++n;

    yield mask;
  }
}

export interface IComponent {
  readonly bitmask: BitSet;
}

export abstract class Component {
  protected static readonly _bitmaskGenerator = bitmaskGenerator();
  protected static _bitmask: BitSet;

  // tslint:disable-next-line: variable-name
  protected readonly __component = true;

  public static get bitmask(): BitSet {
    if (this._bitmask == null) {
      this._bitmask = this._bitmaskGenerator.next().value;
    }

    return this._bitmask;
  }
}

export type ComponentConstructor = Constructor<Component> & IComponent;
