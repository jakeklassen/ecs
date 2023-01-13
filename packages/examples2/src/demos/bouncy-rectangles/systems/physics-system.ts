import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function physicsSystemFactory(
  world: World<Entity>,
  viewport: { width: number; height: number },
) {
  const moving = world.archetype('position', 'rectangle', 'velocity');

  return (dt: number) => {
    for (const entity of moving.entities) {
      entity.position.x += entity.velocity.x * dt;
      entity.position.y += entity.velocity.y * dt;

      if (entity.position.x + entity.rectangle.width > viewport.width) {
        entity.position.x = viewport.width - entity.rectangle.width;
        entity.velocity.x *= -1;
      } else if (entity.position.x < 0) {
        entity.position.x = 0;
        entity.velocity.x *= -1;
      }

      if (entity.position.y + entity.rectangle.height > viewport.height) {
        entity.position.y = viewport.height - entity.rectangle.height;
        entity.velocity.y *= -1;
      } else if (entity.position.y < 0) {
        entity.position.y = 0;
        entity.velocity.y *= -1;
      }
    }
  };
}
