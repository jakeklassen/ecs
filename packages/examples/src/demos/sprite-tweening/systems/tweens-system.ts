import { easeLinear } from '#/lib/tween';
import { System, World } from '@jakeklassen/ecs';
import justSafeSet from 'just-safe-set';
import { Tweens } from '../components/tweens';

export class TweensSystem extends System {
  update(world: World, dt: number): void {
    const view = world.view(Tweens);

    for (const [_entity, components] of view) {
      const { tweens } = components.get(Tweens);

      for (const tween of tweens) {
        tween.time += dt;
        tween.progress = tween.time / tween.duration;

        const component = components.get(tween.component);

        if (component == null) {
          throw new Error(`Component ${tween.component} not found.`);
        }

        if (tween.progress >= 1) {
          tween.iterations++;
          tween.completed = true;
          justSafeSet(component, tween.property, tween.to);

          if (
            tween.maxIterations !== Infinity &&
            tween.iterations >= tween.maxIterations &&
            tween.onComplete === 'remove'
          ) {
            components.delete(tween.component);

            continue;
          }

          if (tween.yoyo === true) {
            tween.progress = 0;
            tween.completed = false;
            tween.time = 0;
            [tween.from, tween.to] = [tween.to, tween.from];
            tween.change = tween.to - tween.from;
          }
        }

        if (tween.completed === false) {
          const change = easeLinear(
            tween.time,
            tween.from,
            tween.change,
            tween.duration,
          );

          justSafeSet(component, tween.property, change);
        }
      }
    }
  }
}
