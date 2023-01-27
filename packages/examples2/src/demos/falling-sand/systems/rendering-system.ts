import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function renderingSystemFactory(world: World<Entity>) {
  const renderables = world.archetype('color', 'render');

  /**
   * This system is responsible for rendering the entities
   * that have the `render` component.
   */
  return (context: CanvasRenderingContext2D, _dt: number) => {
    for (const entity of renderables.entities) {
      const { color } = entity;
      const x = entity.gridIndex % context.canvas.width;
      const y = Math.floor(entity.gridIndex / context.canvas.width);

      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    }
  };
}
