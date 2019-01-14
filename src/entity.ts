export type EntityId = number;

/**
 * Representation of a unique entity value within the world
 */
export class Entity {
  public id: EntityId;

  constructor(id: EntityId) {
    this.id = id;
  }
}
