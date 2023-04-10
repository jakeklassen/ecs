import { AudioManager } from '#/lib/audio-manager.js';
import { rnd } from '#/lib/math.js';
import { Easing } from '#/lib/tween.js';
import { World } from '@jakeklassen/ecs2';
import { transformFactory } from '../components/transform.js';
import { tweenFactory } from '../components/tween.js';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { explosionFactory } from '../entity-factories/explosion.js';
import { GameEvent } from '../game-events.js';
import { GameState } from '../game-state.js';
import { Scene } from '../scene.js';
import { Pico8Colors } from '../constants.js';

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
        // Shockwave
        world.createEntity({
          shockwave: {
            radius: 3,
            targetRadius: 25,
            color: Pico8Colors.Color7,
            speed: 105,
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
        });

        // Initial flash of the explosion
        world.createEntity({
          particle: {
            age: 0,
            maxAge: 0,
            color: Pico8Colors.Color7,
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

        explosionFactory(world, {
          count: 30,
          particleFn: () => ({
            age: rnd(2),
            maxAge: 10 + rnd(20),
            color: Pico8Colors.Color7,
            radius: 1 + rnd(4),
            shape: 'circle',
            isBlue: true,
          }),
          position: {
            x:
              player.transform.position.x +
              (player.sprite?.frame.width ?? 0) / 2,
            y:
              player.transform?.position.y +
              (player.sprite?.frame.height ?? 0) / 2,
          },
          velocityFn: () => ({
            x: Math.random() * 140,
            y: Math.random() * 140,
          }),
        });

        explosionFactory(world, {
          count: 20,
          particleFn: () => ({
            age: rnd(2),
            maxAge: 10 + rnd(10),
            color: Pico8Colors.Color7,
            isBlue: true,
            radius: 1 + rnd(4),
            shape: 'circle',
            spark: true,
          }),
          position: {
            x:
              player.transform.position.x +
              (player.sprite?.frame.width ?? 0) / 2,
            y:
              player.transform?.position.y +
              (player.sprite?.frame.height ?? 0) / 2,
          },
          velocityFn: () => ({
            x: Math.random() * 300,
            y: Math.random() * 300,
          }),
        });

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
