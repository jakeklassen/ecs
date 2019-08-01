import { Component } from './component';
import { Constructor } from './index';

export class ComponentMap {
  private readonly map = new Map<Constructor<Component>, InstanceType<any>>();

  public get(
    ctor: Constructor<Component>,
  ): InstanceType<typeof Component> | undefined {
    return this.map.get(ctor);
  }

  public set(component: InstanceType<typeof Component>) {
    this.map.set(component.constructor as Constructor<Component>, component);
  }

  public has(componentCtor: Constructor<Component>) {
    return this.map.has(componentCtor);
  }

  get size() {
    return this.map.size;
  }
}
