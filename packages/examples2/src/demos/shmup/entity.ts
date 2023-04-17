import { Easing } from '#/lib/tween.js';
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

type Sprite = {
  frame: Frame;
  opacity: number;
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

type Transform = {
  position: Vector2d;
  scale: Vector2d;
  rotation: number;
};

type BoxCollider = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

type TextBlinkAnimation = {
  color: HexColor;
  colors: HexColor[];
  colorSequence: number[];
  currentColorIndex: number;
  delta: number;
  durationMs: number;
  frameRate: number;
};

export type HexColor = `#${string}`;

type Particle = {
  age: number;
  maxAge: number;
  color: string;
  isBlue?: boolean;
  radius: number;
  shape: 'circle';
  spark?: boolean;
};

type Shockwave = {
  radius: number;
  targetRadius: number;
  color: HexColor;
  speed: number;
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

  events?: Array<'start' | 'end' | 'yoyo'>;

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
  events: Array<'start' | 'end' | 'yoyo'>;
  onComplete?: string;
};

/**
 * A type to denote the tweenable properties specifically.
 * We want to avoid types that have circular references.
 */
export type TweenableEntity = Pick<Required<Entity>, 'transform' | 'sprite'>;

export type TweenablePaths = {
  [P in Path<TweenableEntity>]: PathValue<TweenableEntity, P> extends number
    ? P
    : never;
}[Path<TweenableEntity>];

type Tweens = {
  [P in TweenablePaths]: Tween<TweenableEntity, P>;
}[TweenablePaths];

export type Entity = {
  boundToViewport?: true;
  boxCollider?: BoxCollider;

  /**
   * The collision layer of the entity.
   */
  collisionLayer?: number;

  /**
   * The layers that this entity collides with.
   * @example ```ts
   * CollisionMasks.Enemy | CollisionMasks.EnemyProjectile
   * ```
   */
  collisionMask?: number;

  destroyOnViewportExit?: true;
  direction?: Vector2d;
  event?: {
    type: 'TweenEnd';
    entity: Entity;
  };
  eventNextWave?: true;
  eventPlayerEnemyCollision?: {
    player: Entity;
    enemy: Entity;
  };
  eventPlayerProjectileEnemyCollision?: {
    projectile: Entity;
    enemy: Entity;
  };
  eventSpawnWave?: {
    waveNumber: number;
  };
  flash?: {
    alpha: number;
    color: HexColor;
    durationMs: number;
    elapsedMs: number;
  };
  health?: number;
  invulnerable?:
    | true
    | {
        durationMs: number;
        elapsedMs: number;
      };
  muzzleFlash?: {
    color: string;
    durationMs: number;
    elapsed: number;
    initialSize: number;
    size: number;
  };
  particle?: Particle;
  shockwave?: Shockwave;
  sprite?: Sprite;
  spriteAnimation?: SpriteAnimation;
  star?: {
    color: string;
  };
  tagBullet?: true;
  tagEnemy?: true;
  tagHud?: true;
  tagPlayer?: true;
  tagPlayerThruster?: true;
  tagTextCherries?: true;
  tagTextScore?: true;
  tagStartScreenGreenAlien?: true;
  tagText?: true;
  ttl?: {
    durationMs: number;
    elapsedMs: number;
    onComplete: 'entity:destroy';
    trigger?: `nextWave:${number}`;
  };
  text?: {
    align?: 'center' | 'left';
    color: string;
    font: string;
    message: string;
  };
  textBlinkAnimation?: TextBlinkAnimation;
  trackPlayer?: {
    offset?: Vector2d;
  };
  transform?: Transform;
  tweens?: Tweens[];
  velocity?: Vector2d;
};
