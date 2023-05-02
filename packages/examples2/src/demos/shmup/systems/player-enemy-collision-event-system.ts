import { rndInt } from '#/lib/math.js';
import { Easing } from '#/lib/tween.js';
import { World } from '@jakeklassen/ecs2';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { transformFactory } from '../components/transform.js';
import { tweenFactory } from '../components/tween.js';
import { Config } from '../config.js';
import { LoadedContent } from '../content.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';
import { animationDetailsFactory } from '../structures/animation-details.js';
import { TimeSpan, Timer } from '../timer.js';

export function playerEnemyCollisionEventSystemFactory({
  config,
  content,
  gameState,
  timer,
  world,
}: {
  config: Config;
  content: LoadedContent;
  gameState: GameState;
  timer: Timer;
  world: World<Entity>;
}) {
  const events = world.archetype('eventPlayerEnemyCollision');
  const players = world.archetype('tagPlayer', 'transform');
  const playerThrusters = world.archetype('tagPlayerThruster', 'transform');

  return () => {
    const [player] = players.entities;
    const [playerThruster] = playerThrusters.entities;

    for (const entity of events.entities) {
      const { eventPlayerEnemyCollision: event } = entity;

      world.createEntity({
        eventPlaySound: {
          track: 'player-death',
          options: {
            loop: false,
          },
        },
      });

      // decrement lives
      gameState.lives--;

      const explosionIndex = rndInt(content.playerExplosions.height / 64);
      const sourceY = explosionIndex * 64;

      world.createEntity({
        sprite: {
          frame: {
            sourceX: 0,
            sourceY,
            width: 64,
            height: 64,
          },
          opacity: 1,
        },
        spriteAnimation: spriteAnimationFactory(
          animationDetailsFactory(
            `explosion`,
            0,
            sourceY,
            content.playerExplosions.width,
            64,
            64,
            64,
          ),
          100,
          false,
        ),
        spritesheet: 'player-explosions',
        transform: transformFactory({
          position: {
            x:
              (player.transform?.position.x ?? 0) +
              (player.sprite?.frame.width ?? 0) / 2 -
              32,
            y:
              (player.transform?.position.y ?? 0) +
              (player.sprite?.frame.height ?? 0) / 2 -
              32,
          },
        }),
      });

      world.createEntity({
        eventTriggerCameraShake: {
          durationMs: 400,
          strength: 6,
        },
      });

      if (gameState.lives <= 0) {
        world.deleteEntity(event.player);

        if (playerThruster != null) {
          world.deleteEntity(playerThruster);
        }

        // Give the player death sprite time to finish
        timer.add(new TimeSpan(1000), () => {
          world.createEntity({
            eventGameOver: true,
          });
        });
      } else {
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
