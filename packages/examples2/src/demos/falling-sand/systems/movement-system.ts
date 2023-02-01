import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function movementSystemFactory(
  world: World<Entity>,
  entityGrid: Array<Entity>,
  canvas: HTMLCanvasElement,
) {
  const width = canvas.width;
  const rowCount = Math.floor(entityGrid.length / width);
  const modified = new Set<number>();

  function swap(entityA: Entity, entityB: Entity) {
    // Move the entities on the grid BEFORE swapping their gridIndex
    [entityGrid[entityA.gridIndex], entityGrid[entityB.gridIndex]] = [
      entityB,
      entityA,
    ];

    [entityA.gridIndex, entityB.gridIndex] = [
      entityB.gridIndex,
      entityA.gridIndex,
    ];
  }

  return () => {
    modified.clear();

    for (let row = rowCount - 1; row >= 0; row--) {
      const rowOffset = row * width;
      const leftToRight = Math.random() > 0.5;

      for (let i = 0; i < width; i++) {
        let index = leftToRight ? rowOffset + i : rowOffset + width - i;

        const entity = entityGrid[index];

        if (entity?.empty === true) {
          continue;
        }

        const below = index + width;
        const belowLeft = below - 1;
        const belowRight = below + 1;

        const belowEntity = entityGrid[below];
        const belowLeftEntity = entityGrid[belowLeft];
        const belowRightEntity = entityGrid[belowRight];
        const column = index % width;
        let newIndex = index;

        if (belowEntity?.empty === true) {
          swap(entity, belowEntity);
          newIndex = below;

          world.addEntityComponents(entity, 'render', true);
          world.addEntityComponents(belowEntity, 'render', true);
        } else if (
          belowLeftEntity?.empty === true &&
          belowLeft % width < column
        ) {
          swap(entity, belowLeftEntity);
          newIndex = belowLeft;

          world.addEntityComponents(entity, 'render', true);
          world.addEntityComponents(belowLeftEntity, 'render', true);
        } else if (
          belowRightEntity?.empty === true &&
          belowRight % width > column
        ) {
          swap(entity, belowRightEntity);
          newIndex = belowRight;

          world.addEntityComponents(entity, 'render', true);
          world.addEntityComponents(belowRightEntity, 'render', true);
        }

        if (newIndex !== index) {
          modified.add(index);
          modified.add(newIndex);

          index = newIndex;
        }
      }
    }
  };
}
