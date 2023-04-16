import { fillCircle } from '#/lib/canvas.js';
import { World } from '@jakeklassen/ecs2';
import { Pico8Colors } from '../constants.js';
import { Entity } from '../entity.js';

export function muzzleFlashRenderingSystemFactory({
  world,
  context,
}: {
  world: World<Entity>;
  context: CanvasRenderingContext2D;
}) {
  const muzzleFlashes = world.archetype('muzzleFlash', 'transform');

  return (_dt: number) => {
    for (const entity of muzzleFlashes.entities) {
      const { muzzleFlash, transform } = entity;

      context.translate(transform.position.x | 0, transform.position.y | 0);
      context.rotate(transform.rotation);
      context.scale(transform.scale.x, transform.scale.y);

      fillCircle(context, 0, 0, muzzleFlash.size, Pico8Colors.Color7);

      context.resetTransform();
    }
  };
}
