import { Component, ComponentConstructor } from './component';
import { ComponentMap, ISafeComponentMap } from './component-map';
import { Entity } from './entity';
import { System } from './system';

export type Constructor<T> = abstract new (...args: any[]) => T;

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
  private deletedEntities: Set<Entity> = new Set();
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
  public update(dt: number): void {
    this.updateSystems(dt);
  }

  public createEntity(): Entity {
    if (this.deletedEntities.size > 0) {
      const entity = this.deletedEntities.values().next().value;
      this.deletedEntities.delete(entity);

      return entity;
    }

    const entity = new Entity(this.idGenerator.next().value);
    this.entities.set(entity, new ComponentMap());

    return entity;
  }

  /**
   * Delete an entity from the world. Entities can be recycled so do not rely
   * on the deleted entity reference after deleting it.
   * @param entity Entity to delete
   */
  public deleteEntity(entity: Entity): boolean {
    if (this.deletedEntities.has(entity)) {
      return false;
    }

    if (this.entities.has(entity)) {
      const componentMap = this.entities.get(entity)!;

      for (const ctor of componentMap.keys()) {
        this.componentEntities.get(ctor)!.delete(entity);
      }

      componentMap.clear();
      this.deletedEntities.add(entity);

      return true;
    }

    return false;
  }

  public findEntity(
    ...componentCtors: ComponentConstructor[]
  ): Entity | undefined {
    if (componentCtors.length === 0) {
      return undefined;
    }

    const hasAllComponents = componentCtors.every((ctor) =>
      this.componentEntities.has(ctor),
    );

    if (hasAllComponents === false) {
      return undefined;
    }

    const componentSets = componentCtors.map(
      (ctor) => this.componentEntities.get(ctor)!,
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
    entity: Entity,
    ...components: Component[]
  ): World {
    if (this.deletedEntities.has(entity)) {
      throw new Error('Entity has been deleted');
    }

    const entityComponents = this.entities.get(entity);

    if (entityComponents != null) {
      entityComponents.set(...components);

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
    if (this.deletedEntities.has(entity)) {
      return undefined;
    }

    return this.entities.get(entity);
  }

  public removeEntityComponents(
    entity: Entity,
    ...components: Component[]
  ): World {
    if (this.deletedEntities.has(entity)) {
      throw new Error('Entity has been deleted');
    }

    const entityComponents = this.entities.get(entity);

    if (entityComponents != null) {
      entityComponents.remove(
        ...components.map(
          (component) => component.constructor as ComponentConstructor,
        ),
      );

      components.forEach((component) => {
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
  public addSystem(system: System): void {
    this.systemsToAdd.push(system);
  }

  /**
   * Register a system for removal.
   * @param system System
   */
  public removeSystem(system: System): void {
    this.systemsToRemove.push(system);
  }

  public updateSystems(dt: number): void {
    if (this.systemsToRemove.length > 0) {
      this.systems = this.systems.filter((existing) =>
        this.systemsToRemove.includes(existing),
      );

      this.systemsToRemove = [];
    }

    if (this.systemsToAdd.length > 0) {
      this.systemsToAdd.forEach((newSystem) => {
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
  ): Map<Entity, ISafeComponentMap> {
    const entities = new Map<Entity, ISafeComponentMap>();

    if (componentCtors.length === 0) {
      return entities;
    }

    const componentSets = componentCtors.map((ctor) => {
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
      (set) => set !== smallestComponentSet,
    );

    for (const entity of smallestComponentSet) {
      const hasAll = otherComponentSets.every((set) => set.has(entity));

      if (hasAll === true) {
        entities.set(
          entity,
          this.getEntityComponents(entity) as ISafeComponentMap,
        );
      }
    }

    return entities;
  }
}
