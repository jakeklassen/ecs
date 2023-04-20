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

      // ? The bullets were disappearing too early when the player was
      // ? all the way to the right side of the screen.
      // This is used because the bullet sprite, and the ship sprite,
      // are both even numbers in width. This means that the bullet
      // will never _really_ be positioned dead center on the ship,
      // even if it is rendered that way. So we'll allow a little bit
      // of room on the right side check.
      const bulletXBuffer = 1;

      if (
        entity.transform.position.x + entity.boxCollider.offsetX >
        viewport.width - entity.boxCollider.width + bulletXBuffer
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
