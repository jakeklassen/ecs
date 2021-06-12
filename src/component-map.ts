import { BitSet } from './bitset';
import { Component, ComponentConstructor } from './component';

type Modify<T, R> = Omit<T, keyof R> & R;

export interface IComponentMap {
  get<T extends Component>(ctor: ComponentConstructor): T | undefined;
  set(...components: Component[]): void;
  remove(...componentCtors: ComponentConstructor[]): void;
  clear(): void;
  keys(): IterableIterator<ComponentConstructor>;
  has(componentCtor: ComponentConstructor): boolean;
}

export type ISafeComponentMap = Modify<
  IComponentMap,
  {
    get<T extends Component>(ctor: ComponentConstructor): T;
  }
>;

export class ComponentMap implements IComponentMap {
  public bitmask: BitSet = new BitSet(0);
  private readonly map = new Map<ComponentConstructor, Component>();

  public get<T extends Component>(ctor: ComponentConstructor): T | undefined {
    const component = this.map.get(ctor);

    return component != null ? (component as T) : undefined;
  }

  public set(...components: Component[]): void {
    let mask = new BitSet(0);

    for (const component of components) {
      if (
        this.map.has(component.constructor as ComponentConstructor) === false
      ) {
        mask = mask.or((component.constructor as ComponentConstructor).bitmask);
      }

      this.map.set(component.constructor as ComponentConstructor, component);
    }

    this.bitmask = this.bitmask.or(mask);
  }

  public remove(...componentCtors: ComponentConstructor[]): void {
    let mask = new BitSet(0);

    for (const componentCtor of componentCtors) {
      if (this.map.has(componentCtor)) {
        mask = mask.or(componentCtor.bitmask);
      }

      this.map.delete(componentCtor);
    }

    this.bitmask = this.bitmask.xor(mask);
  }

  public clear(): void {
    this.map.clear();
    this.bitmask.clear();
  }

  public keys(): IterableIterator<ComponentConstructor> {
    return this.map.keys();
  }

  public has(componentCtor: ComponentConstructor): boolean {
    return this.map.has(componentCtor);
  }

  get size(): number {
    return this.map.size;
  }
}
