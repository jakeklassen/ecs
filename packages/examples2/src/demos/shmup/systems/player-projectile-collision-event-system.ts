import { AudioManager } from '#/lib/audio-manager.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';

export function playerProjectileCollisionEventSystemFactory({
  world,
  audioManager,
  gameState,
}: {
  world: World<Entity>;
  audioManager: AudioManager;
  gameState: GameState;
}) {
  const events = world.archetype('eventPlayerProjectileEnemyCollision');

  return () => {
    for (const entity of events.entities) {
      const { eventPlayerProjectileEnemyCollision: event } = entity;

      world.deleteEntity(event.projectile);

      if (event.enemy.health != null) {
        event.enemy.health -= 1;

        world.addEntityComponents(event.enemy, 'flash', {
          color: '#ffffff',
          durationMs: 100,
          elapsedMs: 0,
        });

        if (event.enemy.health <= 0) {
          world.deleteEntity(event.enemy);
          gameState.score += 100;
        }
      }

      audioManager.play('player-projectile-hit', {
        loop: false,
      });
    }
  };
}
