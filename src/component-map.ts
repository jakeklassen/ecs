import { Component } from './component';
import { Constructor } from './index';

export class ComponentMap {
  private readonly map = new Map<
    Constructor<Component>,
    InstanceType<typeof Component>
  >();

  public get<T extends Component>(ctor: Constructor<Component>): T | undefined {
    const component = this.map.get(ctor);

    return component != null ? (component as T) : undefined;
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
