import { AudioManager } from '#/lib/audio-manager.js';
import { World } from '@jakeklassen/ecs2';
import { determinePickableEnemies } from '../enemy/determine-pickable-enemies.js';
import { fire } from '../enemy/enemy-bullets.js';
import { pickRandomEnemy } from '../enemy/pick-random-enemy.js';
import { Entity } from '../entity.js';

export function triggerEnemyFireEventSystemFactory({
  audioManager,
  world,
}: {
  audioManager: AudioManager;
  world: World<Entity>;
}) {
  const enemies = world.archetype(
    'enemyState',
    'enemyType',
    'spriteAnimation',
    'tagEnemy',
    'transform',
  );
  const events = world.archetype('eventTriggerEnemyFire');

  return () => {
    for (const event of events.entities) {
      world.deleteEntity(event);

      for (const enemy of enemies.entities) {
        if (
          enemy.enemyType === 'yellowShip' &&
          enemy.enemyState === 'protect'
        ) {
          if (Math.random() < 0.5) {
            // fire spread shot
            // return
          }
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
      if (enemy.enemyType === 'boss') {
        continue;
      }

      if (enemy.enemyType === 'yellowShip') {
        // spread shot
      } else if (enemy.enemyType === 'redFlameGuy') {
        // aimed shot
      } else {
        fire({
          angle: 0,
          audioManager,
          enemy,
          speed: 60,
          world,
        });
      }
    }
  };
}
