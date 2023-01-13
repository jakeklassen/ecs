import { Frame } from '../entity.js';

export const spriteFactory = (frame: Frame, opacity = 1) => ({
  frame,
  opacity,
});
