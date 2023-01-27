import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function removeRenderSystemFactory(world: World<Entity>) {
  const rerenderable = world.archetype('render');

  /**
   * This system removes the `render` component from entities that have it.
   */
  return () => {
    for (const entity of rerenderable.entities) {
      world.removeEntityComponents(entity, 'render');
    }
  };
}
