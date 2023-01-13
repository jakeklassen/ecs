type Vector2d = {
  x: number;
  y: number;
};

type Rectangle = {
  width: number;
  height: number;
};

export type SharedEntity = {
  color?: string;
  position?: Vector2d;
  rectangle?: Rectangle;
  transform?: {
    position: Vector2d;
    rotation: number;
    scale: Vector2d;
  };
  velocity?: Vector2d;
};
