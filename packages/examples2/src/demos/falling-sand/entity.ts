export type Entity = {
  color?: string;
  empty?: true;
  gridIndex: number;
  render?: true;
  moving?: true;
  swap?: {
    with: Entity;
  };
};
