import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function swapSystemFactory(world: World<Entity>, entityGrid: Entity[]) {
  const requireSwap = world.archetype('swap');

  return () => {
    for (const entity of requireSwap.entities) {
      // Swap entities on the grid
      [entityGrid[entity.swap.with.gridIndex], entityGrid[entity.gridIndex]] = [
        entity,
        entity.swap.with,
      ];

      // Swap their grid indices
      [entity.gridIndex, entity.swap.with.gridIndex] = [
        entity.swap.with.gridIndex,
        entity.gridIndex,
      ];

      world.addEntityComponents(entity, 'render', true);
      world.removeEntityComponents(entity, 'swap');
    }
  };
}
