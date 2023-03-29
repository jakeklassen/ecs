import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export const muzzleFlashRenderingSystemFactory = (
  world: World<Entity>,
  context: CanvasRenderingContext2D,
) => {
  const muzzleFlashes = world.archetype('muzzleFlash', 'transform');

  return (_dt: number) => {
    for (const entity of muzzleFlashes.entities) {
      const { muzzleFlash, transform } = entity;

      context.translate(transform.position.x | 0, transform.position.y | 0);
      context.rotate(transform.rotation);
      context.scale(transform.scale.x, transform.scale.y);

      context.fillStyle = 'white';
      context.beginPath();
      context.arc(0, 0, muzzleFlash.size, 0, 2 * Math.PI);
      context.fill();

      context.resetTransform();
    }
  };
};
