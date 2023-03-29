import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function starfieldRenderingSystemFactory(
  world: World<Entity>,
  context: CanvasRenderingContext2D,
) {
  const stars = world.archetype('star', 'transform');

  return (_dt: number) => {
    for (const { star, transform } of stars.entities) {
      context.globalAlpha = 1;

      context.translate(transform.position.x | 0, transform.position.y | 0);
      context.rotate(transform.rotation);
      context.scale(transform.scale.x, transform.scale.y);

      context.fillStyle = star.color;

      context.fillRect(0, 0, 1, 1);

      context.globalAlpha = 1;
      context.resetTransform();
    }
  };
}
