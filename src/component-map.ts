import { BitSet } from 'bitset';
import { Component, ComponentConstructor } from './component';

export class ComponentMap {
  public bitmask: BitSet = new BitSet(0);
  private readonly map = new Map<ComponentConstructor, Component>();

  public get<T extends Component>(ctor: ComponentConstructor): T | undefined {
    const component = this.map.get(ctor);

    return component != null ? (component as T) : undefined;
  }

  public set(component: Component) {
    this.map.set(component.constructor as ComponentConstructor, component);
    this.bitmask = this.bitmask.or(
      (component.constructor as (typeof Component)).bitmask,
    );
  }

  public remove(componentCtor: ComponentConstructor) {
    this.map.delete(componentCtor);
    this.bitmask = this.bitmask.andNot(componentCtor.bitmask);
  }

  public has(componentCtor: ComponentConstructor) {
    return this.map.has(componentCtor);
  }

  get size() {
    return this.map.size;
  }
}
