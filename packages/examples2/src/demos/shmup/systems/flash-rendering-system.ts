import { obtainCanvas2dContext } from '#/lib/dom.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function flashRenderingSystemFactory({
  context,
  spriteSheet,
  world,
}: {
  context: CanvasRenderingContext2D;
  spriteSheet: HTMLImageElement;
  world: World<Entity>;
}) {
  const flashedEntities = world.archetype('flash', 'sprite', 'transform');

  const tintCanvas = document.createElement('canvas');
  tintCanvas.width = context.canvas.width;
  tintCanvas.height = context.canvas.height;

  const tintContext = obtainCanvas2dContext(tintCanvas);
  tintContext.imageSmoothingEnabled = false;

  const bufferCanvas = document.createElement('canvas');
  bufferCanvas.width = context.canvas.width;
  bufferCanvas.height = context.canvas.height;

  const bufferContext = obtainCanvas2dContext(bufferCanvas);
  bufferContext.imageSmoothingEnabled = false;

  return function flashRenderingSystem(dt: number) {
    tintContext.clearRect(0, 0, tintCanvas.width, tintCanvas.height);
    bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

    tintContext.save();

    for (const entity of flashedEntities.entities) {
      const { flash, sprite, transform } = entity;

      flash.elapsedMs += dt * 1000;

      // Calculate the alpha value based on the flashing duration
      flash.alpha -= dt * 2;

      // Convert the color from hex to RGBA
      const red = parseInt(flash.color.substring(1, 3), 16);
      const green = parseInt(flash.color.substring(3, 5), 16);
      const blue = parseInt(flash.color.substring(5, 7), 16);
      const rgba = `rgba(${red},${green},${blue},${flash.alpha})`;

      tintContext.translate(transform.position.x | 0, transform.position.y | 0);
      tintContext.rotate(transform.rotation);
      tintContext.scale(transform.scale.x, transform.scale.y);

      bufferContext.translate(
        transform.position.x | 0,
        transform.position.y | 0,
      );
      bufferContext.rotate(transform.rotation);
      bufferContext.scale(transform.scale.x, transform.scale.y);

      // Draw the sprite with the color tint applied
      tintContext.fillStyle = rgba;
      tintContext.fillRect(0, 0, sprite.frame.width, sprite.frame.height);

      // Draw the sprite on top of the color tint
      bufferContext.drawImage(
        spriteSheet,
        sprite.frame.sourceX,
        sprite.frame.sourceY,
        sprite.frame.width,
        sprite.frame.height,
        transform.scale.x > 0 ? 0 : -sprite.frame.width,
        transform.scale.y > 0 ? 0 : -sprite.frame.height,
        sprite.frame.width,
        sprite.frame.height,
      );

      tintContext.resetTransform();
      bufferContext.resetTransform();

      if (flash.elapsedMs >= flash.durationMs || flash.alpha <= 0) {
        world.removeEntityComponents(entity, 'flash');
      }
    }

    tintContext.globalCompositeOperation = 'destination-atop';

    tintContext.drawImage(bufferCanvas, 0, 0);

    tintContext.restore();

    context.drawImage(tintCanvas, 0, 0);
  };
}
