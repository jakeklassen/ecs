import { AudioManager } from '#/lib/audio-manager.js';
import { Easing } from '#/lib/tween.js';
import { World } from '@jakeklassen/ecs2';
import { tweenFactory } from '../components/tween.js';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { GameEvent } from '../game-events.js';
import { GameState } from '../game-state.js';
import { Scene } from '../scene.js';
import { rnd } from '#/lib/math.js';
import { transformFactory } from '../components/transform.js';

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
        // Initial flash of the explosion
        world.createEntity({
          destroyOnViewportExit: true,
          particle: {
            age: 0,
            maxAge: 0,
            color: '#ffffff',
            radius: 10,
            shape: 'circle',
          },
          transform: transformFactory({
            position: {
              x:
                player.transform.position.x +
                (player.sprite?.frame.width ?? 0) / 2,
              y:
                player.transform?.position.y +
                (player.sprite?.frame.height ?? 0) / 2,
            },
          }),
          velocity: {
            x: 0,
            y: 0,
          },
        });

        for (let i = 0; i < 30; i++) {
          world.createEntity({
            destroyOnViewportExit: true,
            direction: {
              x: 1 * Math.sign(Math.random() * 2 - 1),
              y: 1 * Math.sign(Math.random() * 2 - 1),
            },
            particle: {
              age: rnd(2),
              maxAge: 10 + rnd(20),
              color: '#ffffff',
              radius: 1 + rnd(4),
              shape: 'circle',
              isBlue: true,
            },
            transform: transformFactory({
              position: {
                x:
                  player.transform.position.x +
                  (player.sprite?.frame.width ?? 0) / 2,
                y:
                  player.transform?.position.y +
                  (player.sprite?.frame.height ?? 0) / 2,
              },
            }),
            velocity: {
              x: Math.random() * 140,
              y: Math.random() * 140,
            },
          });
        }

        for (let i = 0; i < 20; i++) {
          world.createEntity({
            destroyOnViewportExit: true,
            direction: {
              x: 1 * Math.sign(Math.random() * 2 - 1),
              y: 1 * Math.sign(Math.random() * 2 - 1),
            },
            particle: {
              age: rnd(2),
              maxAge: 10 + rnd(10),
              color: '#ffffff',
              isBlue: true,
              radius: 1 + rnd(4),
              shape: 'circle',
              spark: true,
            },
            transform: transformFactory({
              position: {
                x:
                  player.transform.position.x +
                  (player.sprite?.frame.width ?? 0) / 2,
                y:
                  player.transform?.position.y +
                  (player.sprite?.frame.height ?? 0) / 2,
              },
            }),
            velocity: {
              x: Math.random() * 300,
              y: Math.random() * 300,
            },
          });
        }

        // respawn player
        if (player != null) {
          player.transform.position.x = config.entities.player.spawnPosition.x;
          player.transform.position.y = config.entities.player.spawnPosition.y;

          world.addEntityComponents(player, 'invulnerable', {
            durationMs: 2000,
            elapsedMs: 0,
          });

          world.addEntityComponents(player, 'tweens', [
            ...(player.tweens ?? []),
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

          world.addEntityComponents(playerThruster, 'tweens', [
            ...(playerThruster.tweens ?? []),
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
      }
    }
  };
}
