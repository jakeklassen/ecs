export const SpriteSheet = {
  gabe: {
    idle: {
      sourceX: 0,
      sourceY: 0,
      width: 24,
      height: 24,
    },
    animations: {
      run: {
        sourceX: 24,
        sourceY: 0,
        width: 144,
        height: 24,
        frameWidth: 24,
        frameHeight: 24,
      },
    },
  },
  enemy: {
    littleGreenGuy: {
      frame0: {
        sourceX: 24,
        sourceY: 0,
        width: 8,
        height: 8,
      },
      frame1: {
        sourceX: 24,
        sourceY: 8,
        width: 8,
        height: 8,
      },
      animations: {
        idle: {
          sourceX: 24,
          sourceY: 0,
          width: 8,
          height: 16,
          frameWidth: 8,
          frameHeight: 8,
        },
        death: {
          sourceX: 0,
          sourceY: 128,
          width: 256,
          height: 160,
          frameWidth: 32,
          frameHeight: 32,
          positionXOffset: -5,
          positionYOffset: -5,
        },
      },
    },
  },
} as const;

export type SpriteSheet = typeof SpriteSheet;
