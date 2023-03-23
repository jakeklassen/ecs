import { Exact, JsonObject } from 'type-fest';
import { Archetype } from './archetype.js';

export type SafeEntity<
  Entity extends JsonObject,
  Components extends keyof Entity,
> = Entity & Required<Pick<Entity, Components>>;

/**
 * Container for Entities
 */
export class World<Entity extends JsonObject> {
  #archetypes = new Set<Archetype<Entity, Array<keyof Entity>>>();
  #entities = new Set<Entity>();

  public get archetypes(): Set<Archetype<Entity, Array<keyof Entity>>> {
    return this.#archetypes;
  }

  public get entities(): ReadonlySet<Entity> {
    return this.#entities;
  }

  public archetype<Components extends Array<keyof Entity>>(
    ...components: Components
  ): Archetype<
    SafeEntity<Entity, (typeof components)[number]>,
    typeof components
  > {
    const entities = new Set<Entity>();

    for (const entity of this.#entities) {
      const matchesArchetype = components.every((component) => {
        return component in entity;
      });

      if (matchesArchetype === true) {
        entities.add(entity);
      }
    }

    const archetype = new Archetype({
      entities,
      world: this,
      components,
    });

    return archetype as Archetype<
      SafeEntity<Entity, (typeof components)[number]>,
      typeof components
    >;
  }

  public createEntity(): Entity;
  /**
   * Create an entity with the given components. This is a type-safe version
   * __but__ it is of a point in time. When the entity is created. So don't
   * rely on it to be type-safe in the future when used within systems.
   */
  public createEntity<T extends Exact<Entity, T>>(
    entity: T,
  ): keyof typeof entity extends never
    ? never
    : SafeEntity<Entity & T, keyof typeof entity>;
  public createEntity(entity?: Entity) {
    const _entity = entity ?? ({} as Entity);

    this.#entities.add(_entity);

    for (const archetype of this.#archetypes) {
      archetype.addEntity(_entity);
    }

    return _entity as SafeEntity<Entity, keyof typeof entity>;
  }

  public deleteEntity(entity: Entity): boolean {
    for (const archetype of this.#archetypes) {
      archetype.removeEntity(entity);
    }

    return this.#entities.delete(entity);
  }

  public addEntityComponents<Component extends keyof Entity>(
    entity: Entity,
    component: Component,
    value: NonNullable<Entity[Component]>,
  ): World<Entity> {
    const existingEntity = this.#entities.has(entity);

    if (existingEntity === false) {
      throw new Error(`Entity ${entity} does not exist`);
    }

    // This will update the key and value in the map
    entity[component] = value;

    for (const archetype of this.#archetypes) {
      const matchesArchetype = archetype.components.every((component) => {
        return component in entity;
      });

      if (matchesArchetype === true) {
        archetype.addEntity(entity);
      }
    }

    return this;
  }

  public removeEntityComponents(
    entity: Entity,
    ...components: Array<keyof Entity>
  ) {
    if (this.#entities.has(entity)) {
      for (const component of components) {
        delete entity[component];
      }

      for (const archetype of this.#archetypes) {
        const matchesArchetype = archetype.components.every((component) => {
          return component in entity;
        });

        if (matchesArchetype === true) {
          archetype.addEntity(entity);
        } else {
          archetype.removeEntity(entity);
        }
      }
    }
  }
}
