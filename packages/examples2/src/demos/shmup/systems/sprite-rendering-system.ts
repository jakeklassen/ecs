import { World } from '@jakeklassen/ecs2';
import { LoadedContent } from '../content.js';
import { Entity } from '../entity.js';

export function spriteRenderingSystemFactory({
  content,
  context,
  world,
}: {
  content: LoadedContent;
  context: CanvasRenderingContext2D;
  world: World<Entity>;
}) {
  const renderables = world
    .archetype('sprite', 'transform')
    .without('textBlinkAnimation', 'flash');

  return (_dt: number) => {
    for (const entity of renderables.entities) {
      const { sprite, transform } = entity;

      context.globalAlpha = sprite.opacity;

      context.translate(transform.position.x | 0, transform.position.y | 0);
      context.rotate(transform.rotation);
      context.scale(transform.scale.x, transform.scale.y);

      let imageSource: CanvasImageSource = content.spritesheet;

      if (entity.spritesheet != null) {
        if (entity.spritesheet === 'explosions') {
          imageSource = content.explosions;
        } else if (entity.spritesheet === 'player-explosions') {
          imageSource = content.playerExplosions;
        }
      }

      context.drawImage(
        imageSource,
        sprite.frame.sourceX,
        sprite.frame.sourceY,
        sprite.frame.width,
        sprite.frame.height,
        transform.scale.x > 0 ? 0 : -sprite.frame.width,
        transform.scale.y > 0 ? 0 : -sprite.frame.height,
        sprite.frame.width,
        sprite.frame.height,
      );

      context.globalAlpha = 1;
      context.resetTransform();
    }
  };
}
