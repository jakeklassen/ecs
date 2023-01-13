import { Easing } from '#/lib/tween';
import { DottedPaths } from '#/lib/types/dotted-paths';
import { JsonObject } from 'type-fest';

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

export type Tween<T> = {
  completed: boolean;
  progress: number;
  iterations: number;
  maxIterations: number;
  time: number;
  start: number;
  end: number;
  change: number;
  duration: number;
  from: number;
  to: number;
  easing: (typeof Easing)[keyof typeof Easing];
  yoyo: boolean;
  onComplete?: string;

  // TODO: Anything better to use here? Look into ts-toolbelt, etc.
  property: DottedPaths<Required<T>>;
};

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
  tweens?: Tween<Required<JsonObject>>[];
};
