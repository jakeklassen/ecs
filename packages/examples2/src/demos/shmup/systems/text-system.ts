import { TextBuffer, TextBufferFont } from '#/lib/pixel-text/text-buffer.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function textSystemFactory({
  fontCache,
  textCache,
  world,
}: {
  fontCache: Map<string, TextBufferFont>;
  textCache: Map<Entity, TextBuffer>;
  world: World<Entity>;
}) {
  const entities = world.archetype('text', 'transform');

  return function textSystem() {
    for (const entity of entities.entities) {
      const { text, transform } = entity;

      // Register this text entity if it hasn't been registered yet
      if (!textCache.has(entity)) {
        const font = fontCache.get(text.font);

        if (font == null) {
          throw new Error(`Font ${text.font} not found`);
        }

        const textBuffer = new TextBuffer({
          color: text.color,
          font,
          text: text.message,
        });

        if (text.align === 'center') {
          transform.position.x =
            transform.position.x - textBuffer.renderable.width / 2;
        }

        textCache.set(entity, textBuffer);
      }
    }
  };
}
