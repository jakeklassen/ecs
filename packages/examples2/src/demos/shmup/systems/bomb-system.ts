import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';
import { CollisionMasks } from '../bitmasks.js';
import { transformFactory } from '../components/transform.js';
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
  const bombEvents = world.archetype('eventTriggerBomb');
  const enemies = world.archetype('boxCollider', 'tagEnemy', 'transform');

  return () => {
    if (
      bombEvents.entities.size === 0 ||
      gameState.waveReady === false ||
      gameState.bombLocked
    ) {
      return;
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

    const [bombEvent] = bombEvents.entities;

    world.deleteEntity(bombEvent);
  };
}
