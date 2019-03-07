import { Constructor } from './';

export type Constructor<T> = new (...args: any[]) => T;

export class ComponentMap {
  private readonly map = new Map<Constructor<{}>, {}>();

  public get<T>(ctor: Constructor<T>): T | undefined {
    return this.map.get(ctor) as T;
  }

  public set<T>(component: T) {
    this.map.set(component.constructor as Constructor<T>, component);
  }

  public has<T>(componentCtor: Constructor<T>) {
    return this.map.has(componentCtor);
  }

  get size() {
    return this.map.size;
  }
}
