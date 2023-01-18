type Vector2d = {
  x: number;
  y: number;
};

export type Entity = {
  color?: string;
  empty?: boolean;
  moved?: boolean;
  node?: {
    north: Entity | null;
    south: Entity | null;
    east: Entity | null;
    west: Entity | null;
  };
  transform: {
    position: Vector2d;
    scale: Vector2d;
    rotation: number;
  };
};
