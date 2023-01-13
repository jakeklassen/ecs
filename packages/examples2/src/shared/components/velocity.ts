import { SharedEntity } from '../shared-entity.js';

export function velocityFactory(): NonNullable<SharedEntity['velocity']> {
  return {
    x: 0,
    y: 0,
  };
}
