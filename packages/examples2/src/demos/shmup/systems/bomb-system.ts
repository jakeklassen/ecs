import { World } from '@jakeklassen/ecs2';
import { CollisionMasks } from '../bitmasks.js';
import { transformFactory } from '../components/transform.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';
import { TimeSpan, Timer } from '../timer.js';

export function bombSystemFactory({
  gameState,
  timer,
  world,
}: {
  gameState: GameState;
  timer: Timer;
  world: World<Entity>;
}) {
  // TODO: Consider archetypes that support a single entity only?
  const bombEvents = world.archetype('eventTriggerBomb');
  const enemies = world.archetype('boxCollider', 'tagEnemy', 'transform');

  return function bombSystem() {
    if (
      bombEvents.entities.size === 0 ||
      gameState.waveReady === false ||
      gameState.bombLocked
    ) {
      return;
    }

    if (bombEvents.entities.size > 1) {
      throw new Error('bomb event should only be triggered once');
    }

    gameState.bombLocked = true;

    let idx = 0;
    for (const enemy of enemies.entities) {
      timer.add(new TimeSpan(50 * idx++), () => {
        world.createEntity({
          boxCollider: {
            width: 8,
            height: 8,
            offsetX: 0,
            offsetY: 0,
          },
          collisionLayer: CollisionMasks.PlayerProjectile,
          collisionMask: CollisionMasks.Enemy,
          tagBomb: true,
          transform: transformFactory({
            position: {
              x:
                enemy.transform.position.x +
                enemy.boxCollider.offsetX +
                enemy.boxCollider.width / 2,
              y:
                enemy.transform.position.y +
                enemy.boxCollider.offsetY +
                enemy.boxCollider.height / 2,
            },
          }),
        });
      });
    }

    // ? Part of me _really_ wants to play a "Bombin the floor!" AVGN sample here

    const [bombEvent] = bombEvents.entities;

    world.deleteEntity(bombEvent);
  };
}
