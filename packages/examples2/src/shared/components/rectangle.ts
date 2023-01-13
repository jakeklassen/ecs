import { SharedEntity } from '../shared-entity.js';

export function rectangleFactory(
  width: number,
  height: number,
): NonNullable<SharedEntity['rectangle']> {
  return {
    width,
    height,
  };
}
