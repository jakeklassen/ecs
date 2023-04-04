import { AudioManager } from '#/lib/audio-manager.js';
import { Easing } from '#/lib/tween.js';
import { World } from '@jakeklassen/ecs2';
import { tweenFactory } from '../components/tween.js';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { GameEvent } from '../game-events.js';
import { GameState } from '../game-state.js';
import { Scene } from '../scene.js';

export function playerEnemyCollisionEventSystemFactory({
  world,
  audioManager,
  config,
  gameState,
  scene,
}: {
  world: World<Entity>;
  audioManager: AudioManager;
  config: Config;
  gameState: GameState;
  scene: Scene;
}) {
  const events = world.archetype('eventPlayerEnemyCollision');
  const players = world.archetype('tagPlayer', 'transform');
  const playerThrusters = world.archetype('tagPlayerThruster', 'transform');

  return () => {
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

          world.addEntityComponents(player, 'invulnerable', {
            durationMs: 1000,
            elapsedMs: 0,
          });
          world.addEntityComponents(player, 'tweens', [
            tweenFactory('sprite.opacity', {
              duration: 100,
              easing: Easing.Linear,
              from: 1,
              to: 0,
              maxIterations: 20,
              yoyo: true,
            }),
          ]);
        }

        if (playerThruster != null) {
          playerThruster.transform.position.x =
            config.entities.player.spawnPosition.x;
          playerThruster.transform.position.y =
            config.entities.player.spawnPosition.y;
        }
      }
    }
  };
}
