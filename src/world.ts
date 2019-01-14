import { Entity, EntityId } from './entity';
import { Type } from './interfaces/type.interface';
import { System } from './system';

export type Component = Type<{}>;

/**
 * Container for Systems and Entities
 */
export class World {
  private systems: System[] = [];
  private entities: Map<EntityId, Component[]> = new Map();

  public update(dt: number) {
    for (const system of this.systems) {
      system.update(this, dt);
    }
  }

  public addSystem(system: System) {
    this.systems.push(system);
  }

  public removeAdd(system: System) {
    this.systems = this.systems.filter(existing => existing === system);
  }

  public view(...components: Component[]): Map<EntityId, Component[]> {
    if (components.length === 0) {
      throw new Error(
        'You must provide a list of component constructor functions',
      );
    }

    const entities = new Map<EntityId, Component[]>();

    for (const [id, entityComponents] of this.entities.entries()) {
      if (entityComponents.length === 0) {
        continue;
      }

      const hasAll = entityComponents.every(
        component => components.find(C => component.constructor === C) != null,
      );

      if (hasAll) {
        entities.set(id, components);
      }
    }

    return entities;
  }
}
