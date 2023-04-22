import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

type BoundToViewportSystemFactoryOptions = {
  viewport: { width: number; height: number };
  world: World<Entity>;
};

/**
 * Factory for system that keeps entities within the viewport.
 */
export function boundToViewportSystemFactory({
  viewport,
  world,
}: BoundToViewportSystemFactoryOptions) {
  const boundToViewport = world.archetype(
    'boundToViewport',
    'boxCollider',
    'transform',
  );

  /**
   * This system keeps entities within the viewport.
   */
  return function boundToViewportSystem() {
    for (const entity of boundToViewport.entities) {
      if (
        entity.transform.position.x + entity.boxCollider.offsetX >
        viewport.width - entity.boxCollider.width
      ) {
        entity.transform.position.x =
          viewport.width -
          entity.boxCollider.width -
          entity.boxCollider.offsetX;
      } else if (entity.transform.position.x + entity.boxCollider.offsetX < 0) {
        entity.transform.position.x = -entity.boxCollider.offsetX;
      }

      if (
        entity.transform.position.y + entity.boxCollider.offsetY >
        viewport.height - entity.boxCollider.height
      ) {
        entity.transform.position.y =
          viewport.height -
          entity.boxCollider.height -
          entity.boxCollider.offsetY;
      } else if (entity.transform.position.y + entity.boxCollider.offsetY < 0) {
        entity.transform.position.y = -entity.boxCollider.offsetY;
      }
    }
  };
}
