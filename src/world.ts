import { Entity, EntityId } from './entity';
import { System } from './system';

export type Type<T> = new (...args: any[]) => T;
// export interface Type<T> extends Function {
//   new (...args: any[]): T;
// }

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
  private entities: Map<EntityId, Array<{}>> = new Map();

  constructor(private readonly idGenerator = entityIdGenerator()) {}

  public update(dt: number) {
    for (const system of this.systems) {
      system.update(this, dt);
    }
  }

  public createEntity(): Entity {
    return new Entity(this.idGenerator.next().value);
  }

  public addEntityComponent<T>(entity: Entity, component: T): World {
    if (this.entities.has(entity.id) === false) {
      this.entities.set(entity.id, [component]);
    } else {
      const current = this.entities.get(entity.id);

      if (current != null) {
        this.entities.set(entity.id, [...current, component]);
      }
    }

    return this;
  }

  /**
   * Register a new system. Systems are executed linearly in the order added.
   * @param system System
   */
  public addSystem(system: System) {
    this.systems.push(system);
  }

  public removeSystem(system: System) {
    this.systems = this.systems.filter(existing => existing === system);
  }

  public updateSystems(dt: number) {
    for (const system of this.systems) {
      system.update(this, dt);
    }
  }

  public view(...components: Array<Type<{}>>): Map<EntityId, Array<{}>> {
    if (components.length === 0) {
      throw new Error(
        'You must provide a list of component constructor functions',
      );
    }

    const entities = new Map<EntityId, Array<{}>>();

    for (const [id, entityComponents] of this.entities.entries()) {
      if (entityComponents.length === 0) {
        continue;
      }

      const hasAll = entityComponents.every(
        component => components.find(C => component.constructor === C) != null,
      );

      if (hasAll) {
        entities.set(id, entityComponents);
      }
    }

    return entities;
  }
}
