import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { fillCircle } from '#/lib/canvas.js';
import { Pico8Colors } from '../constants.js';

export function particleRenderingSystemFactory({
  world,
  context,
}: {
  world: World<Entity>;
  context: CanvasRenderingContext2D;
}) {
  const renderables = world.archetype('particle', 'transform');

  return (_dt: number) => {
    for (const entity of renderables.entities) {
      const { particle, transform } = entity;

      context.translate(transform.position.x | 0, transform.position.y | 0);
      context.rotate(transform.rotation);
      context.scale(transform.scale.x, transform.scale.y);

      if (particle.spark === true) {
        context.fillStyle = Pico8Colors.Color7;
        context.fillRect(0, 0, 1, 1);
      } else if (particle.shape === 'circle') {
        fillCircle(context, 0, 0, particle.radius | 0, particle.color);
      }

      context.globalAlpha = 1;
      context.resetTransform();
    }
  };
}
