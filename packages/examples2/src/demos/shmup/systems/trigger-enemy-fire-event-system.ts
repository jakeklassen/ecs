import { World } from '@jakeklassen/ecs2';
import { EnemyType } from '../constants.js';
import { determinePickableEnemies } from '../enemy/determine-pickable-enemies.js';
import { aimedFire, fire, fireSpread } from '../enemy/enemy-bullets.js';
import { pickRandomEnemy } from '../enemy/pick-random-enemy.js';
import { Entity } from '../entity.js';

export function triggerEnemyFireEventSystemFactory({
  world,
}: {
  world: World<Entity>;
}) {
  const enemies = world.archetype(
    'enemyState',
    'enemyType',
    'spriteAnimation',
    'tagEnemy',
    'transform',
  );
  const players = world.archetype('tagPlayer', 'transform');
  const events = world.archetype('eventTriggerEnemyFire');

  return function triggerEnemyFireEventSystem() {
    for (const event of events.entities) {
      world.deleteEntity(event);

      // Every time we receive this event, we want the yellow ships
      // to have a chance to fire a spread of bullets.
      for (const enemy of enemies.entities) {
        if (
          enemy.enemyType !== EnemyType.YellowShip ||
          enemy.enemyState !== 'protect'
        ) {
          continue;
        }

        if (Math.random() < 0.5) {
          fireSpread({
            count: 12,
            enemy,
            speed: 40,
            world,
          });

          return;
        }
      }

      // Sort by position using x and y, from left to right, top to bottom
      // All _rows_ should be grouped together
      const enemiesArray = determinePickableEnemies(enemies.entities);

      const enemy = pickRandomEnemy(enemiesArray, 10);

      // It's possible that there are no enemies to switch to attack mode,
      // but that are still on the field.
      if (enemy == null) {
        continue;
      }

      // TODO: What do we do with the boss?
      if (enemy.enemyType === EnemyType.Boss) {
        continue;
      }

      if (enemy.enemyType === EnemyType.YellowShip) {
        fireSpread({
          count: 12,
          enemy,
          speed: 40,
          world,
        });
      } else if (enemy.enemyType === EnemyType.RedFlameGuy) {
        const [player] = players.entities;

        if (player == null) {
          continue;
        }

        aimedFire({
          enemy,
          target: player.transform,
          world,
        });
      } else {
        fire({
          angle: 0,
          enemy,
          speed: 60,
          triggerSound: true,
          world,
        });
      }
    }
  };
}
