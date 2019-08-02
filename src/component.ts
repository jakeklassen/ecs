import { Constructor } from './world';

function* bitmaskGenerator(): IterableIterator<bigint> {
  let mask = 0b0001n;

  while (true) {
    mask = mask << 1n;
    yield mask;
  }
}

export interface IComponent {
  readonly bitmask: bigint;
}

export type ComponentConstructor = Constructor<Component> & IComponent;

export abstract class Component {
  protected static readonly _bitmaskGenerator = bitmaskGenerator();
  protected static _bitmask: bigint | null = null;

  // tslint:disable-next-line: variable-name
  protected readonly __component = true;

  public static get bitmask() {
    if (this._bitmask == null) {
      this._bitmask = this._bitmaskGenerator.next().value;
    }

    return this._bitmask;
  }
}
