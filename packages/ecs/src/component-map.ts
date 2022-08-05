import { Component } from './component.js';
import { ComponentConstructor } from './world.js';

/**
 * A ComponentMap with a guaranteed set of Components.
 */
export type SafeComponentMap<T extends ComponentConstructor[]> = {
  // ComponentMap['get'] overload for specific component constructors
  get<C extends T[number]>(ctor: C): InstanceType<C>;
} & ComponentMap;

export class ComponentMap extends Map<ComponentConstructor, Component> {
  public add(...components: Component[]): void {
    components.forEach((component) => {
      this.set(component.constructor as ComponentConstructor, component);
    });
  }

  public override delete(
    ...componentConstructors: ComponentConstructor[]
  ): boolean {
    componentConstructors.forEach((componentConstructor) => {
      super.delete(componentConstructor);
    });

    return true;
  }

  public override has(
    ...componentConstructors: ComponentConstructor[]
  ): boolean {
    return componentConstructors.every((componentConstructor) => {
      return super.has(componentConstructor);
    });
  }

  public override get<C extends Component>(
    componentConstructor: ComponentConstructor<C>,
  ): C | undefined {
    return super.get(componentConstructor) as C;
  }
}
