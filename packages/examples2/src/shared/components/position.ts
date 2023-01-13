import { SharedEntity } from '../shared-entity.js';

export function positionFactory(): NonNullable<SharedEntity['position']> {
  return {
    x: 0,
    y: 0,
  };
}
