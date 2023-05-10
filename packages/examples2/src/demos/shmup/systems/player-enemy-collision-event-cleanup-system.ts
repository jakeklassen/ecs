import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function playerEnemyCollisionEventCleanupSystemFactory({
  world,
}: {
  world: World<Entity>;
}) {
  const events = world.archetype('eventPlayerEnemyCollision');

  return function playerEnemyCollisionEventCleanupSystem() {
    for (const entity of events.entities) {
      world.deleteEntity(entity);
    }
  };
}
