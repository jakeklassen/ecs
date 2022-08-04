import { easeLinear, Easing } from '#/lib/tween';
import { DottedPaths } from '#/lib/types/dotted-paths';
import { Transform } from '#/shared/components/transform';
import { Component, ComponentConstructor, World } from '@jakeklassen/ecs';
import justSafeSet from 'just-safe-set';
import { Sprite } from './sprite';

/**
 * Thinking about a new way to represent many tweens in a
 * single component, with reasonable type safety.
 */

type ComponentDottedPaths<T> = T extends ComponentConstructor<infer C>
  ? keyof C extends never
    ? string
    : DottedPaths<C>
  : never;

interface ITween<T extends ComponentConstructor> {
  component: T;
  property: ComponentDottedPaths<T>;

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

export class Tween<T extends ComponentConstructor> implements ITween<T> {
  public completed = false;
  public progress = 0;
  public iterations = 0;
  public maxIterations: number;
  public component: T;
  public property: ComponentDottedPaths<T>;
  public duration: number;
  public time = 0;
  public from: number;
  public to: number;
  public change: number;
  public yoyo: boolean;
  public onComplete: 'remove';
  public easing: Easing;

  constructor(options: ITween<T>) {
    this.component = options.component;
    this.property = options.property;
    this.duration = options.duration / 1000;
    this.from = options.from;
    this.to = options.to;
    this.change = this.to - this.from;
    this.maxIterations = options.maxIterations ?? Infinity;
    this.yoyo = options.yoyo ?? false;
    this.onComplete = options.onComplete ?? 'remove';
    this.easing = options.easing ?? Easing.Linear;
  }
}

/**
 * A component that represents many tweens.
 */
export class Tweens extends Component {
  constructor(public tweens: Tween<ComponentConstructor>[]) {
    super();
  }
}

new Tweens([
  new Tween({
    component: Sprite,
    property: 'opacity',
    duration: 1000,
    easing: Easing.Linear,
    from: 0,
    to: 1,
  }),
  new Tween({
    component: Transform,
    property: 'position.y',
    duration: 1000,
    easing: Easing.Linear,
    from: 0,
    to: 100,
  }),
]);

// ============================================================================
// Usage
// ============================================================================

const world = new World();

const view = world.view(Tweens);

for (const [_entity, components] of view) {
  const { tweens } = components.get(Tweens);

  for (const tween of tweens) {
    const component = tween.component;

    const change = easeLinear(
      tween.time,
      tween.from,
      tween.change,
      tween.duration,
    );

    justSafeSet(component, tween.property, change);
  }
}
