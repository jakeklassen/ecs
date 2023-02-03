import { Easing } from '#/lib/tween';
import { Path, PathValue } from 'dot-path-value';

type AnimationDetails = {
  name: string;
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
  frameWidth: number;
  frameHeight: number;
};

export type Frame = {
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
};

type SpriteAnimation = {
  delta: number;
  durationMs: number;
  frameRate: number;
  currentFrame: number;
  finished: boolean;
  loop: boolean;
  frames: Frame[];
  frameSequence: number[];
  animationDetails: AnimationDetails;
};

type Vector2d = {
  x: number;
  y: number;
};

export interface TweenOptions {
  /**
   * The duration of the tween in milliseconds.
   */
  duration: number;
  easing: (typeof Easing)[keyof typeof Easing];
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

export type Tween<E extends TweenableEntity, P extends Path<E>> = {
  /**
   * descriminator
   */
  property: P;

  completed: boolean;
  duration: number;
  progress: number;
  iterations: number;
  maxIterations: number;
  time: number;
  start: number;
  end: number;
  change: number;
  from: number;
  to: number;
  easing: (typeof Easing)[keyof typeof Easing];
  yoyo: boolean;
  onComplete?: string;
};

/**
 * A type excluding `tweens` to avoid circular references.
 */
export type TweenableEntity = Omit<Required<Entity>, 'tweens'>;

export type TweenablePaths = {
  [P in Path<TweenableEntity>]: PathValue<TweenableEntity, P> extends number
    ? P
    : never;
}[Path<TweenableEntity>];

type Tweens = {
  [P in TweenablePaths]: Tween<TweenableEntity, P>;
}[TweenablePaths];

export type Entity = {
  sprite?: {
    frame: Frame;
    opacity: number;
  };
  spriteAnimation?: SpriteAnimation;
  transform?: {
    position: Vector2d;
    scale: Vector2d;
    rotation: number;
  };
  tweens?: Tweens[];
};
