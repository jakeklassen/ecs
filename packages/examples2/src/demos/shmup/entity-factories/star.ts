import { rndFromList } from '#/lib/array.js';
import { rndInt } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

interface StarFactoryOptions {
  position: NonNullable<Entity['transform']>['position'];
  world: World<Entity>;
}

export function starFactory({ position, world }: StarFactoryOptions) {
  const entity = world.createEntity({
    direction: {
      x: 0,
      y: 1,
    },
    star: {
      color: 'white',
    },
    transform: {
      position,
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

  // Adjust star color based on velocity
  if (entity.velocity.y < 30) {
    entity.star.color = '#1d2b53';
  } else if (entity.velocity.y < 60) {
    entity.star.color = '#83769b';
  }
}

interface StarfieldFactoryOptions {
  areaHeight: number;
  areaWidth: number;
  count: number;
  world: World<Entity>;
}

export function starfieldFactory({
  areaHeight,
  areaWidth,
  count,
  world,
}: StarfieldFactoryOptions) {
  for (let i = 0; i < count; i++) {
    starFactory({
      position: {
        x: rndInt(areaWidth, 1),
        y: rndInt(areaHeight, 1),
      },
      world,
    });
  }
}
