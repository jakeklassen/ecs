import { JsonObject } from 'type-fest';

type Archetype<Entity extends JsonObject> = {
  entities: Set<Entity>;
};

type ReadonlyArchetype<Entity extends JsonObject> = {
  entities: ReadonlySet<Entity>;
};

type SafeEntity<
  Entity extends JsonObject,
  Components extends keyof Entity,
> = Omit<Entity, Components> & Required<Pick<Entity, Components>>;

type ArchetypeQuery<Entity extends JsonObject> = { with: Array<keyof Entity> };

/**
 * Container for Entities
 */
export class World<Entity extends JsonObject = JsonObject> {
  #archetypes = new Map<ArchetypeQuery<Entity>, Archetype<Entity>>();
  #entities = new Map<Entity, Entity>();
  #componentMasks = new Map<keyof Entity, bigint>();

  #bitmaskStarter = 0n;

  private resolveComponentMask(component: keyof Entity): bigint {
    if (this.#componentMasks.has(component)) {
      return this.#componentMasks.get(component) as bigint;
    }

    const mask = 1n << this.#bitmaskStarter++;

    this.#componentMasks.set(component, mask);

    return mask;
  }

  public get entities(): ReadonlyMap<Entity, Entity> {
    return this.#entities;
  }

  public archetype<Component extends keyof Entity>(
    ...components: Component[]
  ): ReadonlyArchetype<SafeEntity<Entity, (typeof components)[number]>> {
    for (const [query, archetype] of this.#archetypes) {
      const matchesArchetype = components.every((component) => {
        return query.with.includes(component);
      });

      if (matchesArchetype === true) {
        return archetype as unknown as ReadonlyArchetype<
          SafeEntity<Entity, (typeof components)[number]>
        >;
      }
    }

    const key = {
      with: components,
    };

    const entities = new Set<Entity>();

    for (const entity of this.#entities.values()) {
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

    // This is a hack to get around the fact that Set does not allow
    // for the type to be narrowed down to the type of the set. This is
    // because Set is a generic type and the type of the set is not known
    // until runtime. This is a limitation of TypeScript and there is no
    // way to get around it. The only way to get around this is to use
    // a custom Set implementation that allows for the type to be narrowed
    // down to the type of the set.
    return archetype as unknown as ReadonlyArchetype<
      SafeEntity<Entity, (typeof components)[number]>
    >;
  }

  public createEntity(entity: Entity): Entity {
    this.#entities.set(entity, entity);

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
  ): void {
    const existingEntity = this.#entities.get(entity);

    if (existingEntity == null) {
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
  }

  public removeEntityComponents(
    entity: Entity,
    ...components: Array<keyof Entity>
  ) {
    const currentEntity = this.#entities.get(entity);

    if (currentEntity != null) {
      for (const component of components) {
        delete currentEntity[component];
      }

      this.#entities.set(currentEntity, currentEntity);

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

    return currentEntity;
  }
}
