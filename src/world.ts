import { Entity, EntityId } from './entity';
import { System } from './system';

export type Type<T> = new (...args: any[]) => T;

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
  private entities: Map<Entity, Array<{}>> = new Map();

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
      this.entities.set(entity, [component]);
    } else {
      const current = this.entities.get(entity);

      if (current != null) {
        this.entities.set(entity, [...current, component]);
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

  public view(...components: Array<Type<{}>>): Map<Entity, Array<{}>> {
    if (components.length === 0) {
      throw new Error(
        'You must provide a list of component constructor functions',
      );
    }

    const entities = new Map<Entity, Array<{}>>();

    for (const [entity, entityComponents] of this.entities.entries()) {
      if (entityComponents.length === 0) {
        continue;
      }

      const hasAll = entityComponents.every(
        component => components.find(C => component.constructor === C) != null,
      );

      if (hasAll) {
        entities.set(entity, entityComponents);
      }
    }

    return entities;
  }
}
