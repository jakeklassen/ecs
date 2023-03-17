import { JsonObject } from 'type-fest';

type Archetype<Entity extends JsonObject> = {
  entities: Set<Entity>;
};

type ReadonlyArchetype<Entity extends JsonObject> = Readonly<Archetype<Entity>>;

type SafeEntity<
  Entity extends JsonObject,
  Components extends keyof Entity,
> = Entity & Required<Pick<Entity, Components>>;

type ArchetypeQuery<Entity extends JsonObject> = { with: Array<keyof Entity> };

/**
 * Container for Entities
 */
export class World<Entity extends JsonObject = JsonObject> {
  #archetypes = new Map<ArchetypeQuery<Entity>, Archetype<Entity>>();
  #entities = new Set<Entity>();

  public get entities(): Readonly<Set<Entity>> {
    return this.#entities;
  }

  public archetype<Components extends Array<keyof Entity>>(
    ...components: Components
  ): ReadonlyArchetype<SafeEntity<Entity, (typeof components)[number]>> {
    for (const [query, archetype] of this.#archetypes) {
      if (query.with.length !== components.length) {
        continue;
      }

      const matchesArchetype = components.every((component) =>
        query.with.includes(component),
      );

      if (matchesArchetype === true) {
        return archetype as ReadonlyArchetype<
          SafeEntity<Entity, (typeof components)[number]>
        >;
      }
    }

    const key = {
      with: components,
    };

    const entities = new Set<Entity>();

    for (const entity of this.#entities) {
      const matchesArchetype = components.every((component) => {
        return component in entity;
      });

      if (matchesArchetype === true) {
        entities.add(entity);
      }
    }

    const archetype = {
      entities,
    };

    this.#archetypes.set(key, archetype);

    return archetype as ReadonlyArchetype<
      SafeEntity<Entity, (typeof components)[number]>
    >;
  }

  public createEntity(entity: Entity = {} as Entity): Entity {
    this.#entities.add(entity);

    for (const [query, archetype] of this.#archetypes) {
      const matchesArchetype = query.with.every((component) => {
        return component in entity;
      });

      if (matchesArchetype === true) {
        archetype.entities.add(entity);
      }
    }

    return entity;
  }

  public deleteEntity(entity: Entity): boolean {
    for (const archetype of this.#archetypes.values()) {
      archetype.entities.delete(entity);
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

    for (const [query, archetype] of this.#archetypes) {
      const matchesArchetype = query.with.every((component) => {
        return component in entity;
      });

      if (matchesArchetype === true) {
        archetype.entities.add(entity);
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

      for (const [query, archetype] of this.#archetypes) {
        const matchesArchetype = query.with.every((component) => {
          return component in entity;
        });

        if (matchesArchetype === true) {
          archetype.entities.add(entity);
        } else {
          archetype.entities.delete(entity);
        }
      }
    }
  }
}
