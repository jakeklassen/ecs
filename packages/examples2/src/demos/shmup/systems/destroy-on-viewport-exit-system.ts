import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function destroyOnViewportExitSystemFactory({
  world,
  viewport,
}: {
  world: World<Entity>;
  viewport: { width: number; height: number };
}) {
  const boundToViewport = world.archetype(
    'boxCollider',
    'destroyOnViewportExit',
    'transform',
  );

  return (_dt: number) => {
    for (const entity of boundToViewport.entities) {
      if (entity.enemyState === 'flyin') {
        // Don't destroy enemies that are flying in.
        // They start off screen.
        continue;
      }

      let destroy = false;

      if (
        entity.transform.position.x + entity.boxCollider.offsetX >
        viewport.width
      ) {
        destroy = true;
      } else if (entity.transform.position.x + entity.boxCollider.offsetX < 0) {
        destroy = true;
      }

      if (
        entity.transform.position.y + entity.boxCollider.offsetY >
        viewport.height
      ) {
        destroy = true;
      } else if (entity.transform.position.y <= -entity.boxCollider.height) {
        destroy = true;
      }

      if (destroy) {
        world.deleteEntity(entity);
      }
    }
  };
}
