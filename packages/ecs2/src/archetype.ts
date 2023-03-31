import { JsonObject } from 'type-fest';
import { World } from './world.js';

type SafeEntity<
  Entity extends JsonObject,
  Components extends keyof Entity,
> = Entity & Required<Pick<Entity, Components>>;

/**
 * An archetype is a collection of entities that share the same components.
 * Archetypes should not be constructed directly, but rather through the
 * `World` class using the `archetype` method.
 */
export class Archetype<
  Entity extends JsonObject,
  Components extends Array<keyof Entity>,
> {
  #entities: Set<SafeEntity<Entity, Components[number]>> = new Set();
  #components: Components;
  #excluding?: Array<Exclude<keyof Entity, Components[number]>>;
  #world: World<Entity>;

  constructor({
    entities,
    world,
    components,
  }: {
    world: World<Entity>;
    entities: Set<Entity>;
    components: Components;
    without?: Array<Exclude<keyof Entity, Components[number]>>;
  }) {
    this.#world = world;
    this.#entities = entities as Set<SafeEntity<Entity, Components[number]>>;
    this.#components = components;

    world.archetypes.add(this as any);
  }

  public get entities(): ReadonlySet<SafeEntity<Entity, Components[number]>> {
    return this.#entities;
  }

  public get components(): Readonly<Components> {
    return this.#components;
  }

  public get excluding(): Readonly<
    Array<Exclude<keyof Entity, Components[number]>>
  > {
    return this.#excluding ?? [];
  }

  public addEntity(entity: Entity): Archetype<Entity, Components> {
    if (this.#entities.has(entity as any)) {
      return this;
    }

    const matchesArchetype = this.#components.every((component) => {
      return component in entity;
    });

    const matchesExcluding =
      this.#excluding?.every((component) => {
        return component in entity;
      }) ?? false;

    if (!matchesExcluding && matchesArchetype) {
      this.#entities.add(entity as any);
    }

    return this;
  }

  public removeEntity(entity: Entity): Archetype<Entity, Components> {
    this.#entities.delete(entity as any);

    return this;
  }

  clearEntities() {
    this.#entities.clear();
  }

  /**
   * Returns a new archetype based on the current archetype, but excludes the
   * specified components.
   * @param components Components that should **not** be present on the entity
   * @returns
   */
  without<Without extends Array<Exclude<keyof Entity, Components[number]>>>(
    ...components: Without
  ): Archetype<
    SafeEntity<
      Omit<Entity, Without[number]>,
      Exclude<Components[number], (typeof components)[number]>
    >,
    Array<Exclude<Components[number], Without[number]>>
  > {
    const entities = new Set<
      SafeEntity<
        Omit<Entity, Without[number]>,
        Exclude<Components[number], Without[number]>
      >
    >();

    for (const entity of this.#entities) {
      const matchesWithout = components.every((component) => {
        return component in entity;
      });

      if (matchesWithout) {
        continue;
      }

      entities.add(entity as any);
    }

    const archetype = new Archetype<
      SafeEntity<
        Omit<Entity, Without[number]>,
        Exclude<Components[number], (typeof components)[number]>
      >,
      Array<Exclude<Components[number], Without[number]>>
    >({
      entities,
      world: this.#world as any,
      components: this.#components as any,
      without: components as any,
    });

    return archetype;
  }
}
