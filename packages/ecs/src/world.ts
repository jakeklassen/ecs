import { ComponentMap, SafeComponentMap } from './component-map.js';
import { Component } from './component.js';
import { EntityId } from './entity.js';
import { System } from './system.js';

export type ComponentConstructor<T extends Component = Component> = new (
  ...args: any[]
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
  #systems: System[] = [];
  #systemsToRemove: System[] = [];
  #systemsToAdd: System[] = [];
  #entities: Map<EntityId, ComponentMap> = new Map();
  #deletedEntities: Set<EntityId> = new Set();
  #componentEntities: Map<ComponentConstructor, Set<EntityId>> = new Map();

  /**
   * Create a new World instance
   * @param idGenerator Unique entity id generator
   */
  constructor(private readonly idGenerator = entityIdGenerator()) {}

  public get entities(): ReadonlyMap<EntityId, ComponentMap> {
    return this.#entities;
  }

  /**
   * Update all world systems
   * @param dt Delta time
   */
  public update(dt: number): void {
    this.updateSystems(dt);
  }

  public createEntity(): EntityId {
    if (this.#deletedEntities.size > 0) {
      const entity = this.#deletedEntities.values().next().value;
      this.#deletedEntities.delete(entity);

      return entity;
    }

    const entity = this.idGenerator.next().value;
    this.#entities.set(entity, new ComponentMap());

    return entity;
  }

  /**
   * Delete an entity from the world. Entities can be recycled so do not rely
   * on the deleted entity reference after deleting it.
   * @param entity Entity to delete
   */
  public deleteEntity(entity: EntityId): boolean {
    if (this.#deletedEntities.has(entity)) {
      return false;
    }

    const componentMap = this.#entities.get(entity);

    if (componentMap == null) {
      return false;
    }

    for (const ctor of componentMap.keys()) {
      this.#componentEntities.get(ctor)?.delete(entity);
    }

    componentMap.clear();
    this.#deletedEntities.add(entity);

    return true;
  }

  public findEntity(
    ...componentCtors: ComponentConstructor[]
  ): EntityId | undefined {
    if (componentCtors.length === 0) {
      return;
    }

    const hasAllComponents = componentCtors.every((ctor) =>
      this.#componentEntities.has(ctor),
    );

    if (hasAllComponents === false) {
      return;
    }

    const componentSets = componentCtors
      .map((ctor) => {
        return this.#componentEntities.get(ctor);
      })
      .filter((entitySet): entitySet is Set<EntityId> => entitySet != null);

    const smallestComponentSet = componentSets.reduce((smallest, set) => {
      if (smallest == null) {
        smallest = set;
      } else if (set.size < smallest.size) {
        smallest = set;
      }

      return smallest;
    });

    const otherComponentSets = componentSets.filter(
      (set) => set !== smallestComponentSet,
    );

    for (const entity of smallestComponentSet.values()) {
      const hasAll = otherComponentSets.every((set) => set.has(entity));

      if (hasAll === true) {
        return entity;
      }
    }
  }

  public addEntityComponents(
    entity: EntityId,
    ...components: Component[]
  ): World {
    if (this.#deletedEntities.has(entity)) {
      throw new Error('Entity has been deleted');
    }

    const entityComponents = this.#entities.get(entity);

    if (entityComponents != null) {
      entityComponents.add(...components);

      for (const componentCtor of entityComponents.keys()) {
        if (this.#componentEntities.has(componentCtor)) {
          this.#componentEntities.get(componentCtor)?.add(entity);
        } else {
          this.#componentEntities.set(componentCtor, new Set([entity]));
        }
      }
    }

    return this;
  }

  public getEntityComponents(entity: EntityId): ComponentMap | undefined {
    if (this.#deletedEntities.has(entity)) {
      return undefined;
    }

    return this.#entities.get(entity);
  }

  public removeEntityComponents(
    entity: EntityId,
    ...components: Component[]
  ): World {
    if (this.#deletedEntities.has(entity)) {
      throw new Error('Entity has been deleted');
    }

    const entityComponents = this.#entities.get(entity);

    if (entityComponents != null) {
      entityComponents.delete(
        ...components.map(
          (component) => component.constructor as ComponentConstructor,
        ),
      );

      components.forEach((component) => {
        const ctor = component.constructor as ComponentConstructor;
        if (this.#componentEntities.has(ctor)) {
          this.#componentEntities.get(ctor)?.delete(entity);
        }
      });
    }

    return this;
  }

  /**
   * Register a system for addition. Systems are executed linearly in the order added.
   * @param system System
   */
  public addSystem(system: System): void {
    this.#systemsToAdd.push(system);
  }

  /**
   * Register a system for removal.
   * @param system System
   */
  public removeSystem(system: System): void {
    this.#systemsToRemove.push(system);
  }

  public updateSystems(dt: number): void {
    if (this.#systemsToRemove.length > 0) {
      this.#systems = this.#systems.filter((existing) =>
        this.#systemsToRemove.includes(existing),
      );

      this.#systemsToRemove = [];
    }

    if (this.#systemsToAdd.length > 0) {
      this.#systemsToAdd.forEach((newSystem) => {
        if (this.#systems.includes(newSystem) === false) {
          this.#systems.push(newSystem);
        }
      });

      this.#systemsToAdd = [];
    }

    for (const system of this.#systems) {
      system.update(this, dt);
    }
  }

  public view<CC extends ComponentConstructor[]>(
    ...componentCtors: CC
  ): Array<[EntityId, SafeComponentMap<CC>]> {
    const entities: Array<[EntityId, SafeComponentMap<CC>]> = [];

    if (componentCtors.length === 0) {
      return entities;
    }

    const componentSets = componentCtors
      .map((ctor) => {
        return this.#componentEntities.get(ctor);
      })
      .filter((entitySet): entitySet is Set<EntityId> => entitySet != null);

    // Make sure we even have record of all the component constructors
    if (componentSets.length !== componentCtors.length) {
      return entities;
    }

    const smallestComponentSet = componentSets.reduce((smallest, set) => {
      if (smallest == null) {
        smallest = set;
      } else if (set.size < smallest.size) {
        smallest = set;
      }

      return smallest;
    });

    const otherComponentSets = componentSets.filter(
      (set) => set !== smallestComponentSet,
    );

    for (const entity of smallestComponentSet) {
      const hasAll = otherComponentSets.every((set) => set.has(entity));

      if (hasAll === true) {
        entities.push([
          entity,
          this.getEntityComponents(entity) as SafeComponentMap<CC>,
        ]);
      }
    }

    return entities;
  }
}
