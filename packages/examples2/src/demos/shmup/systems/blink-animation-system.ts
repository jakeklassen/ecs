import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { TextBuffer } from '#/lib/pixel-text/text-buffer.js';

export function blinkAnimationSystemFactory({
  textCache,
  world,
}: {
  textCache: Map<Entity, TextBuffer>;
  world: World<Entity>;
}) {
  const entities = world.archetype('blinkAnimation', 'text');

  return (dt: number) => {
    for (const entity of entities.entities) {
      const { blinkAnimation } = entity;

      blinkAnimation.delta += dt;

      if (blinkAnimation.delta >= blinkAnimation.frameRate) {
        blinkAnimation.delta = 0;
        blinkAnimation.currentColorIndex =
          (blinkAnimation.currentColorIndex + 1) %
          blinkAnimation.colorSequence.length;
      }

      blinkAnimation.color =
        blinkAnimation.colors[
          blinkAnimation.colorSequence[blinkAnimation.currentColorIndex]
        ];

      const textBuffer = textCache.get(entity);
      textBuffer?.updateText(textBuffer?.text, {
        color: blinkAnimation.color,
      });
    }
  };
}
