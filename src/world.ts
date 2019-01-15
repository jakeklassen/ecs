import { Entity, EntityId } from './entity';
import { System } from './system';

export type Type<T> = new (...args: any[]) => T;
export type Component = Type<ObjectConstructor>;

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
  private entities: Map<EntityId, Component[]> = new Map();

  constructor(private readonly idGenerator = entityIdGenerator()) {}

  public update(dt: number) {
    for (const system of this.systems) {
      system.update(this, dt);
    }
  }

  public createEntity(): Entity {
    return new Entity(this.idGenerator.next().value);
  }

  public addEntityComponents(
    entity: EntityId,
    ...components: Component[]
  ): void {
    if (this.entities.has(entity) === false) {
      this.entities.set(entity, components);
    } else {
      const current = this.entities.get(entity);

      if (current != null) {
        this.entities.set(entity, [...current, ...components]);
      }
    }
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

  public view(...components: Component[]): Map<EntityId, Component[]> {
    if (components.length === 0) {
      throw new Error(
        'You must provide a list of component constructor functions',
      );
    }

    const entities = new Map<EntityId, Component[]>();

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
