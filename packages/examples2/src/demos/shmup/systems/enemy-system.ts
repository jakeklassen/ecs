import { World } from '@jakeklassen/ecs2';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';

export function enemySystemFactory({
  config,
  gameState,
  world,
}: {
  config: Config;
  gameState: GameState;
  world: World<Entity>;
}) {
  const enemies = world.archetype(
    'enemyDestination',
    'enemyState',
    'tagEnemy',
    'transform',
  );

  return (_dt: number) => {
    const wave = config.waves[gameState.wave];

    if (wave == null) {
      return;
    }

    for (const entity of enemies.entities) {
      if (entity.enemyState === 'flyin') {
        // When flying we want to check if we are at the destination.
        // If we are, we want to remove the tweens and set the state to protect

        const dx =
          (entity.enemyDestination.x - entity.transform.position.x) / 14;
        const dy =
          (entity.enemyDestination.y - entity.transform.position.y) / 14;

        entity.transform.position.x += dx;
        entity.transform.position.y += dy;

        const { enemyDestination, transform } = entity;

        if (Math.abs(transform.position.y - enemyDestination.y) < 0.7) {
          entity.enemyState = 'protect';
          world.removeEntityComponents(entity, 'invulnerable');
        }
      } else if (entity.enemyState === 'protect') {
        // When protecting, we have a chance to fire a bullet, or switch
        // to the attack state
      } else if (entity.enemyState === 'attack') {
        // When attacking, execute the attach pattern associated with the enemy
      }
    }
  };
}
