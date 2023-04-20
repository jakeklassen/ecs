import {
  Tween,
  TweenableEntity,
  TweenablePaths,
  TweenOptions,
} from '../entity.js';

export function tweenFactory<P extends TweenablePaths>(
  property: P,
  options: TweenOptions,
): Tween<TweenableEntity, P> {
  return {
    completed: false,
    progress: 0,
    iterations: 0,
    maxIterations: options.maxIterations ?? 1,
    time: 0,
    property,
    start: options.from,
    end: options.to,
    change: options.to - options.from,
    delay: (options.delay ?? 0) / 1000,
    duration: options.duration / 1000,
    from: options.from,
    to: options.to,
    fullSwing: options.fullSwing ?? false,
    easing: options.easing,
    yoyo: options.yoyo ?? false,
    events: options.events ?? [],
    onComplete: options.onComplete ?? 'remove',
  };
}
