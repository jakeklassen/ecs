import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function renderingSystemFactory(world: World<Entity>) {
  const renderables = world.archetype('color', 'position', 'rerender');

  return (context: CanvasRenderingContext2D, _dt: number) => {
    for (const entity of renderables.entities) {
      const { color, position } = entity;

      if (entity.empty === true) {
        context.clearRect(position.x, position.y, 1, 1);
      } else {
        context.fillStyle = color;
        context.fillRect(position.x, position.y, 1, 1);
      }
    }
  };
}
