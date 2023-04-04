import { AudioManager } from '#/lib/audio-manager.js';
import { World } from '@jakeklassen/ecs2';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { GameEvent } from '../game-events.js';
import { GameState } from '../game-state.js';
import { Scene } from '../scene.js';

export function playerEnemyCollisionEventSystemFactory(
  world: World<Entity>,
  audioManager: AudioManager,
  config: Config,
  gameState: GameState,
  scene: Scene,
) {
  const events = world.archetype('eventPlayerEnemyCollision');
  const players = world.archetype('tagPlayer', 'transform');
  const playerThrusters = world.archetype('tagPlayerThruster', 'transform');

  return () => {
    const handled = new Set<Entity>();

    const [player] = players.entities;
    const [playerThruster] = playerThrusters.entities;

    for (const entity of events.entities) {
      const { eventPlayerEnemyCollision: event } = entity;

      world.deleteEntity(event.enemy);

      audioManager.play('player-death', {
        loop: false,
      });

      // decrement lives
      gameState.lives--;

      if (gameState.lives <= 0) {
        world.deleteEntity(event.player);

        if (playerThruster != null) {
          world.deleteEntity(playerThruster);
        }

        scene.emit(GameEvent.GameOver);
      } else {
        // respawn player
        if (player != null) {
          player.transform.position.x = config.entities.player.spawnPosition.x;
          player.transform.position.y = config.entities.player.spawnPosition.y;
        }

        if (playerThruster != null) {
          playerThruster.transform.position.x =
            config.entities.player.spawnPosition.x;
          playerThruster.transform.position.y =
            config.entities.player.spawnPosition.y;
        }
      }

      handled.add(entity);
    }

    for (const entity of handled) {
      world.deleteEntity(entity);
    }
  };
}
