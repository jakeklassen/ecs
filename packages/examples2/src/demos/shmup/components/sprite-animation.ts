import { Entity } from '../entity.js';

/**
 * Sprite animation factory
 * @param animationDetails
 * @param durationMs
 * @param loop
 * @param frameSequence
 * @returns
 */
export function spriteAnimationFactory(
  animationDetails: NonNullable<Entity['spriteAnimation']>['animationDetails'],
  durationMs: number,
  loop = true,
  frameSequence: number[] = [],
): NonNullable<Entity['spriteAnimation']> {
  const delta = 0;
  const currentFrame = 0;
  const finished = false;
  const frames: NonNullable<Entity['spriteAnimation']>['frames'] = [];

  const horizontalFrames = animationDetails.width / animationDetails.frameWidth;
  const verticalFrames = animationDetails.height / animationDetails.frameHeight;

  for (let i = 0; i < verticalFrames; i++) {
    const sourceY = animationDetails.sourceY + i * animationDetails.frameHeight;

    for (let j = 0; j < horizontalFrames; j++) {
      const sourceX =
        animationDetails.sourceX + j * animationDetails.frameWidth;

      frames.push({
        sourceX,
        sourceY,
        width: animationDetails.frameWidth,
        height: animationDetails.frameHeight,
      });
    }
  }

  if (frameSequence.length === 0) {
    frameSequence = frames.map((_, i) => i);
  }

  // Determine the frame rate based on the duration of the animation
  // and the number of frames.
  // Also divide by 1000 to convert from milliseconds to seconds.
  const frameRate = durationMs / 1_000 / frameSequence.length;

  return {
    delta,
    currentFrame,
    finished,
    frames,
    frameRate,
    frameSequence,
    animationDetails,
    durationMs,
    loop,
  };
}
