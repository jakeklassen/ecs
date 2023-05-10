import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

/**
 * Shockwaves are expanding circles that are used to indicate the
 * area of effect. They expand to a target radius, then are destroyed.
 */
export function shockwaveSystemFactory({ world }: { world: World<Entity> }) {
  const shockwaves = world.archetype('shockwave');

  return function shockwaveSystem(dt: number) {
    for (const entity of shockwaves.entities) {
      const { shockwave } = entity;

      shockwave.radius += shockwave.speed * dt;

      if (shockwave.radius >= shockwave.targetRadius) {
        world.deleteEntity(entity);
      }
    }
  };
}
