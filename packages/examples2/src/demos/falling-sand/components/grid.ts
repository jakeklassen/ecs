import { Entity } from '../entity.js';

export function gridFactory(
  width: number,
  height: number,
  entityGrid: Entity[],
) {
  return {
    width,
    height,
    entities: entityGrid,
  };
}
