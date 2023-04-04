import { AudioManager } from '#/lib/audio-manager.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function playerProjectileCollisionEventSystemFactory(
  world: World<Entity>,
  audioManager: AudioManager,
) {
  return () => {
    const events = world.archetype('eventPlayerProjectileEnemyCollision');

    const handled = new Set<Entity>();

    for (const entity of events.entities) {
      const { eventPlayerProjectileEnemyCollision: event } = entity;

      world.deleteEntity(event.projectile);
      world.deleteEntity(event.enemy);

      audioManager.play('player-projectile-hit', {
        loop: false,
      });

      handled.add(entity);
    }

    for (const entity of handled) {
      world.deleteEntity(entity);
    }
  };
}
