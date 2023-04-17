import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { Config } from '../config.js';
import { transformFactory } from '../components/transform.js';
import { tweenFactory } from '../components/tween.js';
import { Easing } from '#/lib/tween.js';
import { TimeSpan, Timer } from '../timer.js';
import {
  bossFactory,
  greenAlienFactory,
  redFlameGuyFactory,
  spinningShipFactory,
  yellowShipFactory,
} from './enemy.js';

export function spawnWave({
  dt,
  timer,
  wave,
  world,
}: {
  dt: number;
  timer: Timer;
  wave: NonNullable<Config['waves'][string]>;
  world: World<Entity>;
}) {
  for (let y = 0; y < wave.enemies.length; y++) {
    const line = wave.enemies[y];

    for (let x = 0; x < 10; x++) {
      const enemyType = line[x];

      if (enemyType === 0) {
        continue;
      }

      const toXPosition = (x + 1) * 12 - 6;
      const fromXPosition = toXPosition * 1.25 - 16;

      const toYPosition = 4 + (y + 1) * 12;
      const fromYPosition = toYPosition - 66;

      const transform = transformFactory({
        position: {
          x: fromXPosition,
          y: fromYPosition,
        },
      });

      const tweenDuration = 800;

      const tweenXPosition = tweenFactory('transform.position.x', {
        from: fromXPosition,
        to: toXPosition,
        duration: tweenDuration,
        easing: Easing.OutSine,
      });

      const tweenYPosition = tweenFactory('transform.position.y', {
        from: fromYPosition,
        to: toYPosition,
        duration: tweenDuration,
        easing: Easing.OutSine,
      });

      const tweens = [tweenXPosition, tweenYPosition];

      const wait = (x + 1) * 3 * dt;

      if (enemyType === 1) {
        timer.add(new TimeSpan(wait), () => {
          const entity = greenAlienFactory({
            components: {
              invulnerable: true,
              transform,
              tweens,
            },
            world,
          });

          timer.add(new TimeSpan(tweenDuration), () => {
            world.removeEntityComponents(entity, 'invulnerable');
          });
        });
      } else if (enemyType === 2) {
        timer.add(new TimeSpan(wait), () => {
          const entity = redFlameGuyFactory({
            components: {
              invulnerable: true,
              transform,
              tweens,
            },
            world,
          });

          timer.add(new TimeSpan(tweenDuration), () => {
            world.removeEntityComponents(entity, 'invulnerable');
          });
        });
      } else if (enemyType === 3) {
        timer.add(new TimeSpan(wait), () => {
          const entity = spinningShipFactory({
            components: {
              invulnerable: true,
              transform,
              tweens,
            },
            world,
          });

          timer.add(new TimeSpan(tweenDuration), () => {
            world.removeEntityComponents(entity, 'invulnerable');
          });
        });
      } else if (enemyType === 4) {
        timer.add(new TimeSpan(wait), () => {
          const entity = yellowShipFactory({
            components: {
              invulnerable: true,
              transform,
              tweens,
            },
            world,
          });

          timer.add(new TimeSpan(tweenDuration), () => {
            world.removeEntityComponents(entity, 'invulnerable');
          });
        });
      } else if (enemyType === 5) {
        timer.add(new TimeSpan(wait), () => {
          const entity = bossFactory({
            components: {
              invulnerable: true,
              transform,
              tweens,
            },
            world,
          });

          timer.add(new TimeSpan(tweenDuration), () => {
            world.removeEntityComponents(entity, 'invulnerable');
          });
        });
      }
    }
  }
}
