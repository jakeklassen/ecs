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
  const renderables = world.archetype('particle', 'transform', 'velocity');

  return (dt: number) => {
    for (const entity of renderables.entities) {
      const { particle, transform, velocity } = entity;

      particle.age += 30 * dt;
      velocity.x *= 0.85;
      velocity.y *= 0.85;

      if (particle.age > particle.maxAge) {
        particle.radius -= 0.5;

        if (particle.radius <= 0) {
          world.deleteEntity(entity);
          continue;
        }
      }

      particle.color = '#FFF1E8';

      if (particle.isBlue == null) {
        if (particle.age > 5) {
          particle.color = '#FFEC27';
        }

        if (particle.age > 7) {
          particle.color = '#FFA300';
        }

        if (particle.age > 10) {
          particle.color = '#FF004D';
        }

        if (particle.age > 12) {
          particle.color = '#7E2553';
        }

        if (particle.age > 15) {
          particle.color = '#5F574F';
        }
      } else {
        if (particle.age > 5) {
          particle.color = '#C2C3C7';
        }

        if (particle.age > 7) {
          particle.color = '#FFA300';
        }

        if (particle.age > 10) {
          particle.color = '#FF004D';
        }

        if (particle.age > 12) {
          particle.color = '#7E2553';
        }

        if (particle.age > 15) {
          particle.color = '#5F574F';
        }
      }

      context.translate(transform.position.x | 0, transform.position.y | 0);
      context.rotate(transform.rotation);
      context.scale(transform.scale.x, transform.scale.y);

      if (particle.spark === true) {
        context.fillStyle = Pico8Colors.Colour7;
        context.fillRect(0, 0, 1, 1);
      } else if (particle.shape === 'circle') {
        fillCircle(context, 0, 0, particle.radius | 0, particle.color);
      }

      context.globalAlpha = 1;
      context.resetTransform();
    }
  };
}
