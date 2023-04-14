import { obtainCanvas2dContext } from '#/lib/dom.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function blinkRenderingSystemFactory({
  context,
  spriteSheet,
  world,
}: {
  context: CanvasRenderingContext2D;
  spriteSheet: HTMLImageElement;
  world: World<Entity>;
}) {
  const entities = world.archetype('blinkAnimation', 'sprite', 'transform');
  const textCanvas = document.createElement('canvas');
  const textContext = obtainCanvas2dContext(textCanvas);
  textContext.imageSmoothingEnabled = false;

  const tintCanvas = document.createElement('canvas');
  const tintContext = obtainCanvas2dContext(tintCanvas);
  tintContext.imageSmoothingEnabled = false;

  return (_dt: number) => {
    for (const entity of entities.entities) {
      const { blinkAnimation, sprite, transform } = entity;

      textContext.canvas.width = sprite.frame.width;
      textContext.canvas.height = sprite.frame.height;
      textContext.clearRect(
        0,
        0,
        textContext.canvas.width,
        textContext.canvas.height,
      );

      tintContext.canvas.width = sprite.frame.width;
      tintContext.canvas.height = sprite.frame.height;
      tintContext.clearRect(
        0,
        0,
        tintContext.canvas.width,
        tintContext.canvas.height,
      );

      textContext.save();
      textContext.fillStyle = blinkAnimation.color;
      textContext.fillRect(
        0,
        0,
        textContext.canvas.width,
        textContext.canvas.height,
      );

      textContext.globalCompositeOperation = 'destination-atop';
      textContext.globalAlpha = 1;

      tintContext.drawImage(
        spriteSheet,
        sprite.frame.sourceX,
        sprite.frame.sourceY,
        sprite.frame.width,
        sprite.frame.height,
        0,
        0,
        sprite.frame.width,
        sprite.frame.height,
      );

      textContext.drawImage(tintContext.canvas, 0, 0);
      textContext.restore();

      context.drawImage(
        textContext.canvas,
        transform.position.x | 0,
        transform.position.y | 0,
      );
    }
  };
}
