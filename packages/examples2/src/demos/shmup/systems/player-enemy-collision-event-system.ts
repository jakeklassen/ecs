import { AudioManager } from '#/lib/audio-manager.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';

export function playerEnemyCollisionEventSystemFactory(
  world: World<Entity>,
  audioManager: AudioManager,
  gameState: GameState,
) {
  return () => {
    const events = world.archetype('eventPlayerEnemyCollision');
    const playerThrusters = world.archetype('tagPlayerThruster');

    const handled = new Set<Entity>();

    for (const entity of events.entities) {
      const { eventPlayerEnemyCollision: event } = entity;

      world.deleteEntity(event.player);
      world.deleteEntity(event.enemy);

      for (const thruster of playerThrusters.entities) {
        world.deleteEntity(thruster);
      }

      audioManager.play('player-death', {
        loop: false,
      });

      // decrement lives

      handled.add(entity);
    }

    for (const entity of handled) {
      world.deleteEntity(entity);
    }
  };
}
