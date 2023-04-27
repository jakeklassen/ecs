import { obtainCanvas2dContext } from '#/lib/dom.js';
import { World } from '@jakeklassen/ecs2';
import { Entity, HexColor } from '../entity.js';

export function spriteOutlineRenderingSystemFactory({
  context,
  spriteSheet,
  world,
}: {
  context: CanvasRenderingContext2D;
  spriteSheet: HTMLImageElement;
  world: World<Entity>;
}) {
  const spritesOutlined = world.archetype(
    'sprite',
    'spriteOutline',
    'transform',
  );

  const spriteOutlineCache = new Map<Entity, Map<HexColor, ImageData>>();

  const thickness = 1;

  const outlineCanvas = document.createElement('canvas');
  const outlineContext = obtainCanvas2dContext(outlineCanvas, {
    willReadFrequently: true,
  });
  outlineContext.imageSmoothingEnabled = false;

  return function spriteOutlineRenderingSystem() {
    for (const entity of spritesOutlined.entities) {
      const { sprite, transform } = entity;

      context.globalAlpha = sprite.opacity;

      context.translate(transform.position.x | 0, transform.position.y | 0);
      context.rotate(transform.rotation);
      context.scale(transform.scale.x, transform.scale.y);

      const width = sprite.frame.width + thickness * 2;
      const height = sprite.frame.height + thickness * 2;

      outlineCanvas.width = width;
      outlineCanvas.height = height;

      outlineContext.clearRect(
        0,
        0,
        outlineContext.canvas.width,
        outlineContext.canvas.height,
      );

      outlineContext.drawImage(
        spriteSheet,
        sprite.frame.sourceX,
        sprite.frame.sourceY,
        sprite.frame.width,
        sprite.frame.height,
        1,
        1,
        sprite.frame.width,
        sprite.frame.height,
      );

      const cache = spriteOutlineCache.get(entity) ?? new Map();

      let imageData = cache.get(entity.spriteOutline.color);

      if (imageData == null) {
        // Get the pixel data from the temporary canvas
        imageData = outlineContext.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        const modifiedIndices = new Set();

        // convert spriteOutline.color from hex string in format #ffffff to rgb
        const color = {
          r: parseInt(entity.spriteOutline.color.slice(1, 3), 16),
          g: parseInt(entity.spriteOutline.color.slice(3, 5), 16),
          b: parseInt(entity.spriteOutline.color.slice(5, 7), 16),
          a: 255,
        };

        for (let i = 0; i < pixels.length; i += 4) {
          // const r = pixels[i];
          // const g = pixels[i + 1];
          // const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Check if the current pixel is non-transparent
          if (a > 0) {
            const x = (i / 4) % width;
            const y = Math.floor(i / 4 / width);
            const index = (y * width + x) * 4;

            if (modifiedIndices.has(index)) {
              continue;
            }

            // Check the surrounding pixels
            for (let j = -thickness; j <= thickness; j++) {
              for (let k = -thickness; k <= thickness; k++) {
                const neighborX = x + j;
                const neighborY = y + k;

                if (
                  neighborX >= 0 &&
                  neighborX < width &&
                  neighborY >= 0 &&
                  neighborY < height
                ) {
                  const neighborIndex = (neighborY * width + neighborX) * 4;

                  // Check if the neighbor pixel is transparent and has not already been modified
                  if (
                    pixels[neighborIndex + 3] === 0 &&
                    !modifiedIndices.has(neighborIndex)
                  ) {
                    pixels[neighborIndex] = color.r;
                    pixels[neighborIndex + 1] = color.g;
                    pixels[neighborIndex + 2] = color.b;
                    pixels[neighborIndex + 3] = 255;

                    modifiedIndices.add(neighborIndex);
                  }
                }
              }
            }
          }
        }

        cache.set(entity.spriteOutline.color, imageData);
        spriteOutlineCache.set(entity, cache);
      }

      // Put the modified image data back onto the outline canvas
      outlineContext.putImageData(imageData, 0, 0);

      context.drawImage(outlineCanvas, -thickness, -thickness);

      context.globalAlpha = 1;
      context.resetTransform();
    }
  };
}
