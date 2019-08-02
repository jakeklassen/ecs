import { Component, ComponentConstructor } from './component';

export class ComponentMap {
  private readonly map = new Map<ComponentConstructor, Component>();
  private _bitmask: bigint = 0n;

  public get<T extends Component>(ctor: ComponentConstructor): T | undefined {
    const component = this.map.get(ctor);

    return component != null ? (component as T) : undefined;
  }

  public set(component: Component) {
    this.map.set(component.constructor as ComponentConstructor, component);
    this._bitmask =
      this._bitmask | (component.constructor as (typeof Component)).bitmask;
  }

  public remove(componentCtor: ComponentConstructor) {
    this.map.delete(componentCtor);
    this._bitmask = Array.from(this.map.keys()).reduce(
      (bitmask, ctor) => bitmask | ctor.bitmask,
      0n,
    );
  }

  public has(componentCtor: ComponentConstructor) {
    return this.map.has(componentCtor);
  }

  get size() {
    return this.map.size;
  }

  get bitmask() {
    return this._bitmask;
  }
}
