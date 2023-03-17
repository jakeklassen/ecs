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

export type Entity = {
  boxCollider?: BoxCollider;
  direction?: Vector2d;
  muzzleFlash?: {
    duration: number;
    durationMs: number;
    initialSize: number;
    offset: Vector2d;
    size: number;
  };
  sprite?: Sprite;
  spriteAnimation?: SpriteAnimation;
  tagBullet?: true;
  tagPlayer?: true;
  trackPlayer?: {
    offset?: Vector2d;
  };
  transform?: Transform;
  velocity?: Vector2d;
};
