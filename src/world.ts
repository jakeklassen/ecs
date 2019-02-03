import { ComponentMap } from './component-map';
import { Entity } from './entity';
import { System } from './system';

export type Constructor<T> = new (...args: any[]) => T;
// tslint:disable-next-line: ban-types
// export type Constructor<T> = Function & { prototype: T };

export function* entityIdGenerator(): IterableIterator<number> {
  let id = 0;

  while (true) {
    ++id;
    yield id;
  }
}

/**
 * Container for Systems and Entities
 */
export class World {
  private systems: System[] = [];
  private systemsToRemove: System[] = [];
  private systemsToAdd: System[] = [];
  private entities: Map<Entity, ComponentMap> = new Map();

  /**
   * Create a new World instance
   * @param idGenerator Unique entity id generator
   */
  constructor(private readonly idGenerator = entityIdGenerator()) {}

  /**
   * Update all world systems
   * @param dt Delta time
   */
  public update(dt: number) {
    for (const system of this.systems) {
      system.update(this, dt);
    }
  }

  public createEntity(): Entity {
    return new Entity(this.idGenerator.next().value);
  }

  public addEntityComponent<T>(entity: Entity, component: T): World {
    if (this.entities.has(entity) === false) {
      const components = new ComponentMap();
      components.set(component);

      this.entities.set(entity, components);
    } else {
      const components = this.entities.get(entity);

      if (components != null) {
        components.set(component);

        this.entities.set(entity, components);
      }
    }

    return this;
  }

  /**
   * Register a system for addition. Systems are executed linearly in the order added.
   * @param system System
   */
  public addSystem(system: System) {
    this.systemsToAdd.push(system);
  }

  /**
   * Register a system for removal.
   * @param system System
   */
  public removeSystem(system: System) {
    this.systemsToRemove.push(system);
  }

  public updateSystems(dt: number) {
    if (this.systemsToRemove.length > 0) {
      this.systems = this.systems.filter(existing =>
        this.systemsToRemove.includes(existing),
      );

      this.systemsToRemove = [];
    }

    if (this.systemsToAdd.length > 0) {
      this.systemsToAdd.forEach(newSystem => {
        if (this.systems.includes(newSystem) === false) {
          this.systems.push(newSystem);
        }
      });

      this.systemsToAdd = [];
    }

    for (const system of this.systems) {
      system.update(this, dt);
    }
  }

  public view(
    ...components: Array<Constructor<{}>>
  ): Map<Entity, ComponentMap> {
    if (components.length === 0) {
      throw new Error(
        'You must provide a list of component constructor functions',
      );
    }

    const entities = new Map<Entity, ComponentMap>();

    for (const [entity, entityComponents] of this.entities.entries()) {
      if (entityComponents.size === 0) {
        continue;
      }

      const hasAll = components.every(C => entityComponents.get(C) != null);

      if (hasAll) {
        entities.set(entity, entityComponents);
      }
    }

    return entities;
  }
}
