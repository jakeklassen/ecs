import { rndFromList } from '#/lib/array.js';
import { rndInt } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function starfieldSystemFactory(
  world: World<Entity>,
  areaWidth: number,
  areaHeight: number,
  numberOfStars = 100,
) {
  for (let i = 0; i < numberOfStars; i++) {
    const entity = world.createEntity({
      direction: {
        x: 0,
        y: 1,
      },
      star: {
        color: 'white',
      },
      transform: {
        position: {
          x: rndInt(areaWidth, 1),
          y: rndInt(areaHeight, 1),
        },
        rotation: 0,
        scale: {
          x: 1,
          y: 1,
        },
      },
      velocity: {
        x: 0,
        y: rndFromList([60, 30, 20]),
      },
    });

    if (entity.velocity.y < 30) {
      entity.star.color = '#1d2b53';
    } else if (entity.velocity.y < 60) {
      entity.star.color = '#83769b';
    }
  }

  const stars = world.archetype('star', 'transform');

  return (_dt: number) => {
    for (const { transform } of stars.entities) {
      if (transform.position.y > 128) {
        transform.position.y = -1;
        transform.position.x = rndInt(127, 1);
      }
    }
  };
}
