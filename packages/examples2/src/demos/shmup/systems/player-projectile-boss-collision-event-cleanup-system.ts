import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function playerProjectileBossCollisionEventCleanupSystemFactory({
  world,
}: {
  world: World<Entity>;
}) {
  const events = world.archetype('eventPlayerProjectileBossCollision');

  return () => {
    for (const entity of events.entities) {
      world.deleteEntity(entity);
    }
  };
}
