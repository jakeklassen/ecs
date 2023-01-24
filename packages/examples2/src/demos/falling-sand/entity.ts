type Vector2d = {
  x: number;
  y: number;
};

export type Entity = {
  color?: string;
  empty?: true;
  rerender?: true;
  moving?: true;
  node: {
    north: Entity | null;
    south: Entity | null;
    east: Entity | null;
    west: Entity | null;
  };
  swap?: {
    direction: 'north' | 'south' | 'southeast' | 'southwest' | 'east' | 'west';
  };
  // previousPosition: Vector2d;
  position: Vector2d;
};
