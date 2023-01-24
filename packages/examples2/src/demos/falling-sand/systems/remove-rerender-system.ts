import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function removeRerenderSystemFactory(world: World<Entity>) {
  const rerenderable = world.archetype('rerender');

  return () => {
    for (const entity of rerenderable.entities) {
      world.removeEntityComponents(entity, 'rerender');
    }
  };
}
