import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { Timer } from '../timer.js';

// function sin(x: number) {
//   x = x % 1;
//   const pi = 3.14159265359;
//   x = x * pi * 2;
//   let s = x;
//   let t = x;

//   for (let i = 1; i < 8; i++) {
//     t *= (-x * x) / (2 * i * (2 * i + 1));
//     s += t;
//   }
//   return -parseFloat(s.toFixed(3));
// }

export function enemyMovementSystemFactory({
  world,
}: {
  timer: Timer;
  world: World<Entity>;
}) {
  const movables = world.archetype(
    'direction',
    'tagEnemy',
    'transform',
    'velocity',
  );

  // const amplitude = 8;
  // // Frequency of the sine wave (cycles per second)
  // const frequency = 1;
  // const phase = 0;

  return (_dt: number) => {
    for (const entity of movables.entities) {
      if (entity.enemyState === 'attack') {
        // Calculate the value of the sine wave at the current time
        // const velocityX =
        //   -amplitude *
        //   frequency *
        //   2 *
        //   Math.PI *
        //   Math.cos(2 * Math.PI * frequency * gameTime.time + phase);

        // entity.velocity.x = velocityX;
        // entity.velocity.y = 51;

        if (
          entity.enemyType === 'greenAlien' ||
          entity.enemyType === 'redFlameGuy'
        ) {
          // Original code uses the value of 1.7.
          // 1.7 * 30 = 51 which will not be very smooth.
          // entity.velocity.y = 5;
        }
      }
    }
  };
}
