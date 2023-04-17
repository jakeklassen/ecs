import { Easing } from '#/lib/tween.js';
import { World } from '@jakeklassen/ecs2';
import { tweenFactory } from '../components/tween.js';
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

  return () => {
    const wave = config.waves[gameState.wave];

    if (wave == null) {
      return;
    }

    for (const entity of enemies.entities) {
      if (entity.enemyState === 'spawned') {
        // When spawned we want to tween to the destination

        entity.enemyState = 'flyin';
        const tweenDuration = 800;

        const tweenXPosition = tweenFactory('transform.position.x', {
          from: entity.transform.position.x,
          to: entity.enemyDestination.x,
          duration: tweenDuration,
          easing: Easing.OutSine,
        });

        const tweenYPosition = tweenFactory('transform.position.y', {
          from: entity.transform.position.y,
          to: entity.enemyDestination.y,
          duration: tweenDuration,
          easing: Easing.OutSine,
        });

        const tweens = [tweenXPosition, tweenYPosition];

        world.addEntityComponents(entity, 'tweens', tweens);
      } else if (entity.enemyState === 'flyin') {
        // When flying we want to check if we are at the destination.
        // If we are, we want to remove the tweens and set the state to protect

        const { enemyDestination, transform } = entity;

        const atX =
          Math.abs((transform.position.x | 0) - (enemyDestination.x | 0)) === 0;

        const atY =
          Math.abs((transform.position.y | 0) - (enemyDestination.y | 0)) === 0;

        if (atX && atY) {
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
