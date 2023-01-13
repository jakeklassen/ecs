/**
 * This represents a frame of a sprite sheet.
 */
export const frameFactory = (
  sourceX: number,
  sourceY: number,
  width: number,
  height: number,
) => ({
  sourceX,
  sourceY,
  width,
  height,
});
