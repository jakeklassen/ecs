import { SharedEntity } from '../shared-entity.js';

export function transformFactory(
  position = { x: 0, y: 0 },
  rotation = 0,
  scale = { x: 1, y: 1 },
): NonNullable<SharedEntity['transform']> {
  return {
    position,
    rotation,
    scale,
  };
}
