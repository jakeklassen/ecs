export type Entity = {
  color?: string;
  empty?: true;
  grid?: number[];
  gridIndex: number;
  render?: true;
  moving?: true;
  swap?: {
    with: Entity;
  };
};
