import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function redneringSystemFactory(
  world: World<Entity>,
  context: CanvasRenderingContext2D,
) {
  const renderables = world.archetype('color', 'rectangle', 'transform');

  return function renderingSystem() {
    context.clearRect(0, 0, 640, 480);

    for (const entity of renderables.entities) {
      context.fillStyle = entity.color;
      context.fillRect(
        entity.transform.position.x,
        entity.transform.position.y,
        entity.rectangle.width,
        entity.rectangle.height,
      );
    }
  };
}
