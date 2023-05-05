import { World } from '@jakeklassen/ecs2';
import { EnemyType } from '../constants.js';
import { determinePickableEnemies } from '../enemy/determine-pickable-enemies.js';
import { pickRandomEnemy } from '../enemy/pick-random-enemy.js';
import { switchEnemyToAttackMode } from '../enemy/switch-enemy-to-attach-mode.js';
import { Entity } from '../entity.js';
import { Timer } from '../timer.js';

export function triggerEnemyAttackEventSystemFactory({
  timer,
  world,
}: {
  timer: Timer;
  world: World<Entity>;
}) {
  const enemies = world.archetype(
    'enemyState',
    'enemyType',
    'spriteAnimation',
    'tagEnemy',
    'transform',
  );
  const events = world.archetype('eventTriggerEnemyAttack');

  return () => {
    for (const event of events.entities) {
      world.deleteEntity(event);

      // Only trigger 50% of the time
      if (Math.random() < 0.5) {
        continue;
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

      switchEnemyToAttackMode({
        enemy,
        timer,
        world,
      });
    }
  };
}
