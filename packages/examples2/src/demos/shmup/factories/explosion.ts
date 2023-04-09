import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { transformFactory } from '../components/transform.js';

interface ExplosionFactoryOptions {
  count: number;
  directionFn?: () => Entity['direction'];
  particleFn: () => NonNullable<Entity['particle']>;
  position: NonNullable<Entity['transform']>['position'];
  velocityFn: () => NonNullable<Entity['velocity']>;
}

function randomDirection() {
  return {
    x: 1 * Math.sign(Math.random() * 2 - 1),
    y: 1 * Math.sign(Math.random() * 2 - 1),
  };
}

export function explosionFactory(
  world: World<Entity>,
  {
    count,
    directionFn = randomDirection,
    particleFn,
    position,
    velocityFn,
  }: ExplosionFactoryOptions,
) {
  for (let i = 0; i < count; i++) {
    world.createEntity({
      direction: directionFn(),
      particle: particleFn(),
      transform: transformFactory({
        position,
      }),
      velocity: velocityFn(),
    });
  }
}
