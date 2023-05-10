import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function movementSystemFactory({ world }: { world: World<Entity> }) {
  const movables = world.archetype('direction', 'transform', 'velocity');

  return function movementSystem(dt: number) {
    for (const entity of movables.entities) {
      entity.transform.position.x +=
        entity.velocity.x * entity.direction.x * dt;

      entity.transform.position.y +=
        entity.velocity.y * entity.direction.y * dt;
    }
  };
}
