import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function blinkAnimationSystemFactory({
  world,
}: {
  world: World<Entity>;
}) {
  const entities = world.archetype('blinkAnimation');

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
    }
  };
}
