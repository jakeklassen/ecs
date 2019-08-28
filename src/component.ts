import { BitSet } from './bitset';
import { Constructor } from './world';

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

export type ComponentConstructor = Constructor<Component> & IComponent;

export abstract class Component {
  protected static readonly _bitmaskGenerator = bitmaskGenerator();
  protected static _bitmask: BitSet;

  // tslint:disable-next-line: variable-name
  protected readonly __component = true;

  public static get bitmask() {
    if (this._bitmask == null) {
      this._bitmask = this._bitmaskGenerator.next().value;
    }

    return this._bitmask;
  }
}
