import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { circ } from '#/lib/canvas.js';

export function shockwaveRenderingSystemFactory({
  context,
  world,
}: {
  context: CanvasRenderingContext2D;
  world: World<Entity>;
}) {
  const shockwaves = world.archetype('shockwave', 'transform');

  return (_dt: number) => {
    for (const entity of shockwaves.entities) {
      const { shockwave, transform } = entity;

      context.fillStyle = shockwave.color;

      circ(
        context,
        transform.position.x | 0,
        transform.position.y | 0,
        shockwave.radius,
        shockwave.color,
      );
    }
  };
}