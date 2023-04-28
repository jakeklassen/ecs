import { rndInt } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { transformFactory } from '../components/transform.js';
import { Config } from '../config.js';
import { Pico8Colors } from '../constants.js';
import { LoadedContent } from '../content.js';
import { cherryFactory } from '../entity-factories/cherry.js';
import { Entity } from '../entity.js';
import { assertEnityHasOrThrow } from '../entity/assert.js';
import { GameState } from '../game-state.js';
import { animationDetailsFactory } from '../structures/animation-details.js';

export function playerProjectileCollisionEventSystemFactory({
  config,
  content,
  gameState,
  world,
}: {
  config: Config;
  content: LoadedContent;
  gameState: GameState;
  world: World<Entity>;
}) {
  const events = world.archetype('eventPlayerProjectileEnemyCollision');

  return () => {
    for (const entity of events.entities) {
      const { eventPlayerProjectileEnemyCollision: event } = entity;

      world.deleteEntity(event.projectile);

      // Spawn a shockwave - only for bullets
      if (event.projectile.tagBullet) {
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
      }

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

          const explosionIndex = rndInt(content.explosions.height / 64);
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
                content.explosions.width,
                64,
                64,
                64,
              ),
              100,
              false,
            ),
            spritesheet: 'explosions',
            transform: transformFactory({
              position: {
                x:
                  (event.projectile.transform?.position.x ?? 0) +
                  (event.projectile.sprite?.frame.width ?? 0) / 2 -
                  32,
                y:
                  (event.projectile.transform?.position.y ?? 0) +
                  (event.projectile.sprite?.frame.height ?? 0) / 2 -
                  32,
              },
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
