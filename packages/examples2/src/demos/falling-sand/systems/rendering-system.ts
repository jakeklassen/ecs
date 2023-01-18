import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function renderingSystemFactory(world: World<Entity>) {
  const renderables = world.archetype('color', 'transform');

  return (context: CanvasRenderingContext2D, _dt: number) => {
    const canvas = context.canvas;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const entity of renderables.entities) {
      if (entity.empty === true) {
        continue;
      }

      const { color, transform } = entity;

      context.fillStyle = color;
      context.fillRect(transform.position.x, transform.position.y, 1, 1);
    }
  };
}
