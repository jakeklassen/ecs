import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { varyColor } from '../lib/color.js';
import random from 'just-random';

type Mouse = {
  down: boolean;
  position: {
    x: number;
    y: number;
  };
};

export const SAND_COLOR = '#dcb159';

export function mouseSystemFactory(
  world: World<Entity>,
  mouse: Mouse,
  canvas: HTMLCanvasElement,
  entityGrid: Entity[],
) {
  /**
   * Radius within which to replace entities.
   */
  const radius = 3;
  const probability = 0.5;
  const radiusSq = radius * radius;

  let colors: string[] = [];
  const uniqueColors = new Set<string>();

  while (uniqueColors.size < 100) {
    uniqueColors.add(varyColor(SAND_COLOR).toString());
  }

  colors = Array.from(uniqueColors);

  return () => {
    if (!mouse.down) {
      return;
    }

    const x = Math.floor(mouse.position.x);
    const y = Math.floor(mouse.position.y);

    for (let y1 = -radius; y1 <= radius; y1++) {
      for (let x1 = -radius; x1 <= radius; x1++) {
        if (x1 * x1 + y1 * y1 <= radiusSq && Math.random() < probability) {
          const xx = x + x1;
          const yy = y + y1;

          if (xx < 0 || xx >= canvas.width || yy < 0 || yy >= canvas.height) {
            continue;
          }

          const gridIndex = xx + yy * canvas.width;
          const entity = entityGrid.at(gridIndex);

          if (entity?.empty !== true) {
            continue;
          }

          entity.color = random(colors);
          world.removeEntityComponents(entity, 'empty');
          world.addEntityComponents(entity, 'render', true);
          world.addEntityComponents(entity, 'moving', true);
        }
      }
    }
  };
}
