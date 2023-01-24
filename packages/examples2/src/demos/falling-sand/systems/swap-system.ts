import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function swapSystemFactory(world: World<Entity>) {
  const requireSwap = world.archetype('swap');

  return () => {
    for (const entity of requireSwap.entities) {
      if (entity.swap.direction === 'south') {
        if (entity.node.south == null) {
          throw new Error('entity.node.south is null');
        }

        world.removeEntityComponents(entity.node.south, 'empty');
        world.addEntityComponents(entity.node.south, 'moving', true);
        world.addEntityComponents(entity, 'empty', true);
        world.removeEntityComponents(entity, 'moving');

        entity.node.south.color = entity.color;
        entity.color = 'black';
        world.addEntityComponents(entity.node.south, 'rerender', true);
      } else if (entity.swap.direction === 'southwest') {
        if (entity.node.south?.node.west == null) {
          throw new Error('entity south west node is null');
        }

        world.removeEntityComponents(entity.node.south.node.west, 'empty');
        world.addEntityComponents(entity.node.south.node.west, 'moving', true);
        world.addEntityComponents(entity, 'empty', true);
        world.removeEntityComponents(entity, 'moving');

        entity.node.south.node.west.color = entity.color;
        entity.color = 'black';
        world.addEntityComponents(
          entity.node.south.node.west,
          'rerender',
          true,
        );
      } else if (entity.swap.direction === 'southeast') {
        if (entity.node.south?.node.east == null) {
          throw new Error('entity south east node is null');
        }

        world.removeEntityComponents(entity.node.south.node.east, 'empty');
        world.addEntityComponents(entity.node.south.node.east, 'moving', true);
        world.addEntityComponents(entity, 'empty', true);
        world.removeEntityComponents(entity, 'moving');

        entity.node.south.node.east.color = entity.color;
        entity.color = 'black';
        world.addEntityComponents(
          entity.node.south.node.east,
          'rerender',
          true,
        );
      }

      world.addEntityComponents(entity, 'rerender', true);
      world.removeEntityComponents(entity, 'swap');
    }
  };
}
