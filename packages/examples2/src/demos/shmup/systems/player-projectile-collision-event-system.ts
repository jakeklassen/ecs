import { AudioManager } from '#/lib/audio-manager.js';
import { rnd } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { transformFactory } from '../components/transform.js';
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
          alpha: 1,
          color: '#ffffff',
          durationMs: 100,
          elapsedMs: 0,
        });

        if (event.enemy.health <= 0) {
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
                  (event.enemy.transform?.position.x ?? 0) +
                  (event.enemy.sprite?.frame.width ?? 0 / 2),
                y:
                  (event.enemy.transform?.position.y ?? 0) +
                  (event.enemy.sprite?.frame.height ?? 0 / 2),
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
              },
              transform: transformFactory({
                position: {
                  x: (event.enemy.transform?.position.x ?? 0) + 4,
                  y: (event.enemy.transform?.position.y ?? 0) + 4,
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
                  x: (event.enemy.transform?.position.x ?? 0) + 4,
                  y: (event.enemy.transform?.position.y ?? 0) + 4,
                },
              }),
              velocity: {
                x: Math.random() * 300,
                y: Math.random() * 300,
              },
            });
          }

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
