export type EntityId = number;

/**
 * Representation of a unique entity value within the world
 */
export class Entity {
  private version = 0;

  constructor(public id: EntityId) {}
}
