import { Constructor } from './index';

export class ComponentMap {
  private readonly map = new Map<Constructor<unknown>, unknown>();

  public get<T extends Constructor>(ctor: T): InstanceType<T> | undefined {
    return this.map.get(ctor) as InstanceType<T>;
  }

  public set<T extends Constructor<T>>(component: InstanceType<T>) {
    this.map.set(component.constructor as Constructor<T>, component);
  }

  public has<T extends Constructor>(componentCtor: T) {
    return this.map.has(componentCtor);
  }

  get size() {
    return this.map.size;
  }
}
