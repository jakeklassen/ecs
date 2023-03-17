import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function movementSystemFactory(world: World<Entity>) {
  const movables = world.archetype('direction', 'transform', 'velocity');

  return (dt: number) => {
    for (const entity of movables.entities) {
      // ! Ewww, we need to be able to exclude entities from archetypes.
      if (entity.playerTag != null) {
        continue;
      }

      entity.transform.position.x +=
        entity.velocity.x * entity.direction.x * dt;

      entity.transform.position.y +=
        entity.velocity.y * entity.direction.y * dt;
    }
  };
}
