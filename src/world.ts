import { BitSet } from 'bitset';
import { Component, ComponentConstructor } from './component';
import { ComponentMap } from './component-map';
import { Entity } from './entity';
import { System } from './system';

export type Constructor<T = unknown, Arguments extends any[] = any[]> = new (
  ...args: Arguments
) => T;

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
    const entity = new Entity(this.idGenerator.next().value);
    this.entities.set(entity, new ComponentMap());

    return entity;
  }

  public findEntity(
    ...componentCtors: ComponentConstructor[]
  ): Entity | undefined {
    if (componentCtors.length === 0) {
      return undefined;
    }

    const targetBitmask = componentCtors.reduce(
      (bitmask, ctor) => bitmask.or(ctor.bitmask),
      new BitSet(0),
    );

    for (const [entity, entityComponents] of this.entities.entries()) {
      if (entityComponents.size === 0) {
        continue;
      }

      if (entityComponents.bitmask.and(targetBitmask).equals(targetBitmask)) {
        return entity;
      }
    }
  }

  public addEntityComponent(entity: Entity, component: Component): World {
    const components = this.entities.get(entity);

    if (components != null) {
      components.set(component);

      this.entities.set(entity, components);
    } else {
      throw new Error('Entity not found');
    }

    return this;
  }

  public addEntityComponents(
    entity: Entity,
    ...components: Component[]
  ): World {
    components.forEach(component => this.addEntityComponent(entity, component));

    return this;
  }

  public getEntityComponents(entity: Entity): ComponentMap | undefined {
    return this.entities.get(entity);
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
    ...components: ComponentConstructor[]
  ): Map<Entity, ComponentMap> {
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
