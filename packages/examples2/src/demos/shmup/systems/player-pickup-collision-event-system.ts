import { World } from '@jakeklassen/ecs2';
import { transformFactory } from '../components/transform.js';
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

      // Pickup sound
      world.createEntity({
        eventPlaySound: {
          track: 'pickup',
          options: {
            loop: false,
          },
        },
      });
    }
  };
}
