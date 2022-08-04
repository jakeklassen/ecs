import { Easing } from '#/lib/tween';
import { DottedPaths } from '#/lib/types/dotted-paths';
import { Component, ComponentConstructor } from '@jakeklassen/ecs';

export interface TweenOptions {
  /**
   * The duration of the tween in milliseconds.
   */
  duration: number;
  easing: Easing;
  from: number;
  to: number;

  /**
   * Defaults to Infinity and only applies to yoyo tweens.
   */
  maxIterations?: number;

  /**
   * Defaults to false.
   */
  yoyo?: boolean;

  onComplete?: 'remove' | undefined;
}

export abstract class Tween<
  T extends ComponentConstructor,
  I extends InstanceType<T>,
> extends Component {
  public completed = false;
  public progress = 0;
  public iterations = 0;
  public options: Required<TweenOptions>;
  public time = 0;
  public start: number;
  public end: number;
  public change: number;
  public duration: number;

  constructor(
    public component: T,
    public property: DottedPaths<I>,
    options: TweenOptions,
  ) {
    super();

    this.options = {
      duration: options.duration,
      easing: options.easing,
      from: options.from,
      to: options.to,
      maxIterations: options.maxIterations ?? Infinity,
      yoyo: options.yoyo ?? false,
      onComplete: options.onComplete ?? 'remove',
    };

    this.start = this.options.from;
    this.end = this.options.to;
    this.change = this.end - this.start;
    this.duration = this.options.duration / 1000;
  }
}
