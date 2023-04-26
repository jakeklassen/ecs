import { Entity, HexColor } from '../entity.js';

export function spriteOutlineAnimationFactory({
  colors,
  colorSequence,
  durationMs,
}: {
  colors: HexColor[];
  colorSequence: number[];
  durationMs: number;
}): NonNullable<Entity['spriteOutlineAnimation']> {
  const delta = 0;
  const currentColorIndex = 0;
  const color = colors[colorSequence[currentColorIndex]];
  const frameRate = durationMs / 1_000 / colorSequence.length;

  return {
    color,
    colors,
    colorSequence,
    currentColorIndex,
    delta,
    durationMs,
    frameRate,
  };
}
