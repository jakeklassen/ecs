import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function shockwaveSystemFactory({ world }: { world: World<Entity> }) {
  const shockwaves = world.archetype('shockwave');

  return (dt: number) => {
    for (const entity of shockwaves.entities) {
      const { shockwave } = entity;

      shockwave.radius += shockwave.speed * dt;

      if (shockwave.radius >= shockwave.targetRadius) {
        world.deleteEntity(entity);
      }
    }
  };
}
