import { DottedPaths } from '#/lib/types/dotted-paths';
import { Entity, Tween, TweenOptions } from '../entity.js';

export function tweenFactory(
  property: DottedPaths<Required<Entity>>,
  options: TweenOptions,
): Tween<Entity> {
  return {
    completed: false,
    progress: 0,
    iterations: 0,
    maxIterations: options.maxIterations ?? Infinity,
    time: 0,
    property,
    start: options.from,
    end: options.to,
    change: options.to - options.from,
    duration: options.duration / 1000,
    from: options.from,
    to: options.to,
    easing: options.easing,
    yoyo: options.yoyo ?? false,
    onComplete: options.onComplete ?? 'remove',
  };
}
