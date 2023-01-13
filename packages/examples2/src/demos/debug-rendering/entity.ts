import { SharedEntity } from '#/shared/shared-entity.js';

type AnimationDetails = {
  name: string;
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
  frameWidth: number;
  frameHeight: number;
};

type BoxCollider = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
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

export type Entity = SharedEntity & {
  boxCollider?: BoxCollider;
  direction?: Vector2d;
  playerTag?: boolean;
  sprite?: {
    frame: Frame;
    opacity: number;
  };
  spriteAnimation?: SpriteAnimation;
  transform?: {
    position: Vector2d;
    rotation: number;
    scale: Vector2d;
  };
};
