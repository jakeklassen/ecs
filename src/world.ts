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
  private componentEntities: Map<ComponentConstructor, Set<Entity>> = new Map();

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

    const hasAllComponents = componentCtors.every(ctor =>
      this.componentEntities.has(ctor),
    );

    if (hasAllComponents === false) {
      return undefined;
    }

    const componentSets = componentCtors.map(
      ctor => this.componentEntities.get(ctor)!,
    );

    const smallestComponentSet = componentSets.reduce((smallest, set) => {
      if (smallest == null) {
        smallest = set;
      } else if (set.size < smallest.size) {
        smallest = set;
      }

      return smallest;
    });

    const otherComponentSets = componentSets.filter(
      set => set !== smallestComponentSet,
    );

    for (const entity of smallestComponentSet.values()) {
      const hasAll = otherComponentSets.every(set => set.has(entity));

      if (hasAll === true) {
        return entity;
      }
    }
  }

  public addEntityComponents(
    entity: Entity,
    ...components: Component[]
  ): World {
    const entityComponents = this.entities.get(entity);

    if (entityComponents != null) {
      components.forEach(component => entityComponents.set(component));

      for (const componentCtor of entityComponents.keys()) {
        if (this.componentEntities.has(componentCtor)) {
          this.componentEntities.get(componentCtor)!.add(entity);
        } else {
          this.componentEntities.set(componentCtor, new Set([entity]));
        }
      }
    }

    return this;
  }

  public getEntityComponents(entity: Entity): ComponentMap | undefined {
    return this.entities.get(entity);
  }

  public removeEntityComponents(
    entity: Entity,
    ...components: Component[]
  ): World {
    const entityComponents = this.entities.get(entity);

    if (entityComponents != null) {
      components.forEach(component =>
        entityComponents.remove(component.constructor as ComponentConstructor),
      );

      components.forEach(component => {
        const ctor = component.constructor as ComponentConstructor;
        if (this.componentEntities.has(ctor)) {
          this.componentEntities.get(ctor)!.delete(entity);
        }
      });
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
    ...componentCtors: ComponentConstructor[]
  ): Map<Entity, ComponentMap> {
    const entities = new Map<Entity, ComponentMap>();

    if (componentCtors.length === 0) {
      return entities;
    }

    const componentSets = componentCtors.map(ctor => {
      if (this.componentEntities.has(ctor) === false) {
        throw new Error(`Component ${ctor.name} not found`);
      }

      return this.componentEntities.get(ctor)!;
    });

    const smallestComponentSet = componentSets.reduce((smallest, set) => {
      if (smallest == null) {
        smallest = set;
      } else if (set.size < smallest.size) {
        smallest = set;
      }

      return smallest;
    });

    const otherComponentSets = componentSets.filter(
      set => set !== smallestComponentSet,
    );

    for (const entity of smallestComponentSet) {
      const hasAll = otherComponentSets.every(set => set.has(entity));

      if (hasAll === true) {
        entities.set(entity, this.getEntityComponents(entity)!);
      }
    }

    return entities;
  }
}
