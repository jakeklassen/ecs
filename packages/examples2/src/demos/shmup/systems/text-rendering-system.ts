import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { TextBuffer } from '#/lib/pixel-text/text-buffer.js';

export function textRenderingSystemFactory({
  context,
  textCache,
  world,
}: {
  context: CanvasRenderingContext2D;
  textCache: Map<Entity, TextBuffer>;
  world: World<Entity>;
}) {
  const textRenderables = world.archetype('text', 'transform');

  return (_dt: number) => {
    for (const entity of textRenderables.entities) {
      const { transform } = entity;

      const textBuffer = textCache.get(entity);

      if (textBuffer == null) {
        throw new Error(`Text buffer not found for entity`);
      }

      context.translate(transform.position.x | 0, transform.position.y | 0);
      context.rotate(transform.rotation);
      context.scale(transform.scale.x, transform.scale.y);

      context.drawImage(textBuffer.renderable, 0, 0);

      context.globalAlpha = 1;
      context.resetTransform();
    }
  };
}
