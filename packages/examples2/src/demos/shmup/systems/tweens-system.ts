import { easeLinear } from '#/lib/tween';
import { World } from '@jakeklassen/ecs2';
import justSafeGet from 'just-safe-get';
import justSafeSet from 'just-safe-set';
import { Entity } from '../entity.js';

export function tweenSystemFactory({ world }: { world: World<Entity> }) {
  const tweened = world.archetype('tweens');

  return (dt: number) => {
    for (const entity of tweened.entities) {
      const { tweens } = entity;

      for (let i = tweens.length - 1; i >= 0; i--) {
        const tween = tweens[i];
        tween.time += dt;
        tween.progress = tween.time / tween.duration;

        const property = justSafeGet(entity, tween.property);

        if (property == null) {
          throw new Error(`Property ${tween.property} not found on entity.`);
        }

        if (tween.progress >= 1) {
          tween.iterations++;
          tween.completed = true;
          justSafeSet(entity, tween.property, tween.to);

          if (tween.events.includes('end')) {
            if (tween.yoyo && tween.iterations % 2 === 0) {
              world.createEntity({
                event: {
                  type: 'TweenEnd',
                  entity,
                },
              });
            }
          }

          if (
            tween.maxIterations !== Infinity &&
            tween.iterations >= tween.maxIterations &&
            tween.onComplete === 'remove'
          ) {
            tweens.splice(i, 1);

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

          justSafeSet(entity, tween.property, change);
        }
      }
    }
  };
}
