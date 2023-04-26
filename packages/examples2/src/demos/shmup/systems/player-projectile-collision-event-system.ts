import { rnd } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { transformFactory } from '../components/transform.js';
import { Config } from '../config.js';
import { Pico8Colors } from '../constants.js';
import { cherryFactory } from '../entity-factories/cherry.js';
import { explosionFactory } from '../entity-factories/explosion.js';
import { Entity } from '../entity.js';
import { assertEnityHasOrThrow } from '../entity/assert.js';
import { GameState } from '../game-state.js';

export function playerProjectileCollisionEventSystemFactory({
  config,
  gameState,
  world,
}: {
  config: Config;
  gameState: GameState;
  world: World<Entity>;
}) {
  const events = world.archetype('eventPlayerProjectileEnemyCollision');

  return () => {
    for (const entity of events.entities) {
      const { eventPlayerProjectileEnemyCollision: event } = entity;

      world.deleteEntity(event.projectile);

      // Spawn a shockwave
      world.createEntity({
        shockwave: {
          radius: 3,
          targetRadius: 6,
          color: Pico8Colors.Color9,
          speed: 30,
        },
        transform: transformFactory({
          position: {
            x:
              (event.projectile.transform?.position.x ?? 0) +
              (event.projectile.sprite?.frame.width ?? 0) / 2,
            y:
              (event.projectile.transform?.position.y ?? 0) +
              (event.projectile.sprite?.frame.height ?? 0) / 2,
          },
        }),
      });

      if (event.enemy.invulnerable !== true && event.enemy.health != null) {
        event.enemy.health -= event.damage;

        world.addEntityComponents(event.enemy, 'flash', {
          alpha: 1,
          color: Pico8Colors.Color7,
          durationMs: 100,
          elapsedMs: 0,
        });

        // Enemy is dead
        if (event.enemy.health <= 0) {
          assertEnityHasOrThrow(event.enemy, 'enemyType');

          const enemyConfig = config.entities.enemies[event.enemy.enemyType];

          let cherryChance = 0.1;
          let scoreMultiplier = 1;

          if (event.enemy.enemyState === 'attack') {
            scoreMultiplier = 2;
            cherryChance = 0.2;

            if (Math.random() < 0.5) {
              world.createEntity({
                eventTriggerEnemyAttack: true,
              });
            }
          }

          if (Math.random() < cherryChance) {
            cherryFactory({
              transform: event.enemy.transform,
              world,
            });
          }

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
                  (event.projectile.transform?.position.x ?? 0) +
                  (event.projectile.sprite?.frame.width ?? 0) / 2,
                y:
                  (event.projectile.transform?.position.y ?? 0) +
                  (event.projectile.sprite?.frame.height ?? 0) / 2,
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
                  (event.enemy.transform?.position.x ?? 0) +
                  (event.enemy.sprite?.frame.width ?? 0) / 2,
                y:
                  (event.enemy.transform?.position.y ?? 0) +
                  (event.enemy.sprite?.frame.height ?? 0) / 2,
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
              maxAge: 10 + rnd(10),
              color: Pico8Colors.Color7,
              radius: 1 + rnd(4),
              shape: 'circle',
            }),
            position: {
              x:
                (event.enemy.transform?.position.x ?? 0) +
                (event.enemy.sprite?.frame.width ?? 0) / 2,
              y:
                (event.enemy.transform?.position.y ?? 0) +
                (event.enemy.sprite?.frame.height ?? 0) / 2,
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
                (event.enemy.transform?.position.x ?? 0) +
                (event.enemy.sprite?.frame.width ?? 0) / 2,
              y:
                (event.enemy.transform?.position.y ?? 0) +
                (event.enemy.sprite?.frame.height ?? 0) / 2,
            },
            velocityFn: () => ({
              x: Math.random() * 300,
              y: Math.random() * 300,
            }),
          });

          world.deleteEntity(event.enemy);

          world.createEntity({
            eventPlaySound: {
              track: 'enemy-death',
              options: {
                loop: false,
              },
            },
          });

          gameState.score += enemyConfig.score * scoreMultiplier;
        }
      }

      world.createEntity({
        eventPlaySound: {
          track: 'player-projectile-hit',
          options: {
            loop: false,
          },
        },
      });
    }
  };
}
