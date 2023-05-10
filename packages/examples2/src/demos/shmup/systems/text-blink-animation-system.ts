import { TextBuffer } from '#/lib/pixel-text/text-buffer.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function textBlinkAnimationSystemFactory({
  textCache,
  world,
}: {
  textCache: Map<Entity, TextBuffer>;
  world: World<Entity>;
}) {
  const entities = world.archetype('textBlinkAnimation', 'text');

  return function textBlinkAnimationSystem(dt: number) {
    for (const entity of entities.entities) {
      const { textBlinkAnimation } = entity;

      textBlinkAnimation.delta += dt;

      if (textBlinkAnimation.delta >= textBlinkAnimation.frameRate) {
        textBlinkAnimation.delta = 0;
        textBlinkAnimation.currentColorIndex =
          (textBlinkAnimation.currentColorIndex + 1) %
          textBlinkAnimation.colorSequence.length;
      }

      textBlinkAnimation.color =
        textBlinkAnimation.colors[
          textBlinkAnimation.colorSequence[textBlinkAnimation.currentColorIndex]
        ];

      const textBuffer = textCache.get(entity);
      textBuffer?.updateText(textBuffer?.text, {
        color: textBlinkAnimation.color,
      });
    }
  };
}
