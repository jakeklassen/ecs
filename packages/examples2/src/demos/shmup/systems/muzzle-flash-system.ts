import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function muzzleFlashSystemFactory({ world }: { world: World<Entity> }) {
  const muzzleFlashes = world.archetype('muzzleFlash');

  return function muzzleFlashSystem(dt: number) {
    for (const entity of muzzleFlashes.entities) {
      entity.muzzleFlash.elapsed += dt;
      entity.muzzleFlash.size -= 0.5;

      if (
        entity.muzzleFlash.size < 0 ||
        entity.muzzleFlash.elapsed >= entity.muzzleFlash.durationMs
      ) {
        world.deleteEntity(entity);
      }
    }
  };
}
