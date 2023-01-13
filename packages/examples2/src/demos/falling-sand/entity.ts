type Vector2d = {
  x: number;
  y: number;
};

export type Entity = {
  transform?: {
    position: Vector2d;
    scale: Vector2d;
    rotation: number;
  };
  sprite?: {
    frame: {
      sourceX: number;
      sourceY: number;
      width: number;
      height: number;
    };
    opacity: number;
  };
  spriteAnimation?: {
    delta: number;
    durationMs: number;
    frameRate: number;
    currentFrame: number;
    finished: boolean;
    loop: boolean;
    frames: {
      sourceX: number;
      sourceY: number;
      width: number;
      height: number;
    }[];
    frameSequence: number[];
    animationDetails: {
      name: string;
      sourceX: number;
      sourceY: number;
      width: number;
      height: number;
      frameWidth: number;
      frameHeight: number;
    };
  };
};
