import { World } from '@jakeklassen/ecs2';
import { SetRequired } from 'type-fest';
import { transformFactory } from '../components/transform.js';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { TimeSpan, Timer } from '../timer.js';
import {
  bossFactory,
  greenAlienFactory,
  redFlameGuyFactory,
  spinningShipFactory,
  yellowShipFactory,
} from './enemy.js';

export function spawnWave({
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

      const destinationX = (x + 1) * 12 - 6;
      const destinationY = 4 + (y + 1) * 12;

      const spawnPosition = {
        x: destinationX * 1.25 - 16,
        y: destinationY - 66,
      };

      const enemyDestination = {
        x: destinationX,
        y: destinationY,
      };

      const transform = transformFactory({
        position: {
          x: spawnPosition.x,
          y: spawnPosition.y,
        },
      });

      const enemyState = 'flyin';

      const components: SetRequired<
        Entity,
        'enemyDestination' | 'enemyState' | 'invulnerable' | 'transform'
      > = {
        enemyDestination,
        enemyState,
        invulnerable: true,
        transform,
      };

      const wait = x * 90;

      if (enemyType === 1) {
        timer.add(new TimeSpan(wait), () => {
          greenAlienFactory({
            components,
            world,
          });
        });
      } else if (enemyType === 2) {
        timer.add(new TimeSpan(wait), () => {
          redFlameGuyFactory({
            components,
            world,
          });
        });
      } else if (enemyType === 3) {
        timer.add(new TimeSpan(wait), () => {
          spinningShipFactory({
            components,
            world,
          });
        });
      } else if (enemyType === 4) {
        timer.add(new TimeSpan(wait), () => {
          yellowShipFactory({
            components,
            world,
          });
        });
      } else if (enemyType === 5) {
        timer.add(new TimeSpan(wait), () => {
          bossFactory({
            components,
            world,
          });
        });
      }
    }
  }
}
