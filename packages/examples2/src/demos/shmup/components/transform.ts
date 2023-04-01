import { PartialDeep } from 'type-fest';
import { Entity } from '../entity.js';

export function transformFactory(
  transform: PartialDeep<Entity['transform']> = {},
): Entity['transform'] {
  return {
    position: {
      x: transform.position?.x ?? 0,
      y: transform.position?.y ?? 0,
    },
    rotation: transform.rotation ?? 0,
    scale: {
      x: transform.scale?.x ?? 1,
      y: transform.scale?.y ?? 1,
    },
  };
}
