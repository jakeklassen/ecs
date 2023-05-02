import { World } from '@jakeklassen/ecs2';
import { textBlinkAnimationFactory } from '../components/text-blink-animation.js';
import { transformFactory } from '../components/transform.js';
import { ttlFactory } from '../components/ttl.js';
import { Pico8Colors } from '../constants.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';

export function playerPickupCollisionEventSystemFactory({
  gameState,
  world,
}: {
  gameState: GameState;
  world: World<Entity>;
}) {
  const events = world.archetype('eventPlayerPickupCollision');

  return function playerPickupCollisionEventSystem() {
    for (const entity of events.entities) {
      const { eventPlayerPickupCollision: event } = entity;

      world.deleteEntity(event.pickup);
      world.deleteEntity(entity);

      gameState.cherries++;
      let track = 'pickup';
      let message: string | null = null;

      if (gameState.cherries >= 10) {
        gameState.cherries = 0;

        if (gameState.lives < 4) {
          gameState.lives++;

          // 1up sound
          track = 'extra-life';
          message = '1UP!';
        } else {
          gameState.score += 500;
          message = '500';
        }
      }

      // Play sound
      world.createEntity({
        eventPlaySound: {
          track,
          options: {
            loop: false,
          },
        },
      });

      // Show message
      if (message != null) {
        world.createEntity({
          direction: {
            x: 0,
            y: -1,
          },
          text: {
            align: 'center',
            color: Pico8Colors.Color7,
            font: 'PICO-8',
            message,
          },
          textBlinkAnimation: textBlinkAnimationFactory({
            colors: [Pico8Colors.Color7, Pico8Colors.Color8],
            colorSequence: [0, 1],
            durationMs: 100,
          }),
          transform: transformFactory({
            position: {
              x: event.pickup.transform?.position.x ?? 0 + 4,
              y: event.pickup.transform?.position.y ?? 0 + 4,
            },
          }),
          ttl: ttlFactory({ durationMs: 2000 }),
          velocity: {
            x: 0,
            y: 15,
          },
        });
      }

      // Shockwave
      world.createEntity({
        shockwave: {
          radius: 3,
          targetRadius: 6,
          color: Pico8Colors.Color14,
          speed: 30,
        },
        transform: transformFactory({
          position: {
            x:
              (event.pickup.transform?.position.x ?? 0) +
              (event.pickup.sprite?.frame.width ?? 0) / 2,
            y:
              (event.pickup.transform?.position.y ?? 0) +
              (event.pickup.sprite?.frame.height ?? 0) / 2,
          },
        }),
      });
    }
  };
}
