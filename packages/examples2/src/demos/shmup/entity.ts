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
  boundToViewport?: true;
  boxCollider?: BoxCollider;
  destroyOnViewportExit?: true;
  direction?: Vector2d;
  muzzleFlash?: {
    color: string;
    durationMs: number;
    elapsed: number;
    initialSize: number;
    size: number;
  };
  sprite?: Sprite;
  spriteAnimation?: SpriteAnimation;
  star?: {
    color: string;
  };
  tagBullet?: true;
  tagHud?: true;
  tagPlayer?: true;
  tagText?: true;
  trackPlayer?: {
    offset?: Vector2d;
  };
  transform?: Transform;
  velocity?: Vector2d;
};
