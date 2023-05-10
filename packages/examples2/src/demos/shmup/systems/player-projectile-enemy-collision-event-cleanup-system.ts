import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function playerProjectileEnemyCollisionEventCleanupSystemFactory({
  world,
}: {
  world: World<Entity>;
}) {
  const events = world.archetype('eventPlayerProjectileEnemyCollision');

  return function playerProjectileEnemyCollisionEventCleanupSystem() {
    for (const entity of events.entities) {
      world.deleteEntity(entity);
    }
  };
}
