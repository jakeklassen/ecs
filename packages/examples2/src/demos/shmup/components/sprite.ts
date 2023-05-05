import { SetRequired } from 'type-fest';
import { SpriteLayer } from '../constants.js';
import { Entity } from '../entity.js';

export function spriteFactory(
  sprite: SetRequired<Partial<NonNullable<Entity['sprite']>>, 'frame'>,
): NonNullable<Entity['sprite']> {
  return {
    frame: {
      sourceX: sprite.frame.sourceX,
      sourceY: sprite.frame.sourceY,
      width: sprite.frame.width,
      height: sprite.frame.height,
    },
    layer: sprite.layer ?? SpriteLayer.Base,
    opacity: sprite.opacity ?? 1,
    paletteSwaps: sprite.paletteSwaps ?? [],
  };
}
