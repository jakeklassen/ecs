import { System, World } from '@jakeklassen/ecs';
import { Sprite } from '../components/sprite';
import { SpriteAnimation } from '../components/sprite-animation';

export class SpriteAnimationSystem extends System {
  update(world: World, dt: number): void {
    for (const [_entity, components] of world.view(SpriteAnimation, Sprite)) {
      const animation = components.get(SpriteAnimation);
      const sprite = components.get(Sprite);

      if (animation.finished && !animation.loop) {
        // You could do something like spawn a SpriteAnimationFinishedEvent here.
        // Then handle it in another system.
        // world.addEntityComponents(
        //   world.createEntity(),
        //   new SpriteAnimationFinishedEvent(entity, animation),
        // );
      }

      animation.delta += dt;

      if (animation.delta >= animation.frameRate) {
        animation.delta = 0;

        animation.currentFrame =
          (animation.currentFrame + 1) % animation.frameSequence.length;

        if (animation.currentFrame === 0 && !animation.loop) {
          animation.finished = true;
          continue;
        }

        sprite.frame =
          animation.frames[animation.frameSequence[animation.currentFrame]];
      }
    }
  }
}
