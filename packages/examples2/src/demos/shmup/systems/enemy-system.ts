import { rndInt } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';
import { tweenFactory } from '../components/tween.js';
import { Easing } from '#/lib/tween.js';
import { TimeSpan, Timer } from '../timer.js';

export function enemySystemFactory({
  config,
  gameState,
  timer,
  world,
}: {
  config: Config;
  gameState: GameState;
  timer: Timer;
  world: World<Entity>;
}) {
  const enemies = world.archetype(
    'enemyDestination',
    'enemyState',
    'enemyType',
    'tagEnemy',
    'transform',
  );

  let attackFrequencyTimer = 0;
  let fireFrequencyTimer = 0;

  return (dt: number) => {
    if (gameState.waveReady === false) {
      return;
    }

    const wave = config.waves[gameState.wave];

    if (wave == null) {
      return;
    }

    // Sort by position using x and y, from left to right, top to bottom
    // All y positions should be grouped together
    const enemiesArray = Array.from(enemies.entities).sort((a, b) => {
      if (a.transform.position.y < b.transform.position.y) {
        return -1;
      }

      if (a.transform.position.y > b.transform.position.y) {
        return 1;
      }

      if (a.transform.position.x < b.transform.position.x) {
        return -1;
      }

      if (a.transform.position.x > b.transform.position.x) {
        return 1;
      }

      return 0;
    });

    attackFrequencyTimer += dt;
    fireFrequencyTimer += dt;

    if (attackFrequencyTimer >= wave.attackFrequency) {
      attackFrequencyTimer = 0;

      const max = Math.min(enemies.entities.size - 1, 10);
      const randomIndex = rndInt(max);
      const enemyIndex = enemies.entities.size - randomIndex;

      const enemy = enemiesArray[enemyIndex];

      if (enemy == null || enemy.enemyState === 'attack') {
        return;
      }

      enemy.enemyState = 'attack';

      const velocity = {
        x: 0,
        y: 30,
      };

      if (enemy.enemyType === 'greenAlien') {
        // Original code uses the value of 1.7.
        // 1.7 * 30 = 51 which will not be very smooth.
        velocity.y = 30;
      }

      const xTween = tweenFactory('transform.position.x', {
        duration: 500,
        easing: Easing.OutSine,
        from: enemy.transform.position.x,
        to: enemy.enemyDestination.x + 8,
        maxIterations: 1,
      });

      timer.add(new TimeSpan(500), () => {
        if (world.entities.has(enemy) === false) {
          return;
        }

        world.addEntityComponents(
          enemy,
          'tweens',
          (enemy.tweens ?? []).concat(
            tweenFactory('transform.position.x', {
              duration: 1000,
              easing: Easing.OutSine,
              from: enemy.transform.position.x,
              to: enemy.enemyDestination.x - 8,
              yoyo: true,
            }),
          ),
        );
      });

      world.addEntityComponents(enemy, 'direction', {
        x: 0,
        y: 1,
      });
      world.addEntityComponents(enemy, 'velocity', velocity);
      world.addEntityComponents(
        enemy,
        'tweens',
        (enemy.tweens ?? []).concat(xTween),
      );
    }
  };
}
