export const SpriteSheet = {
  bullet: {
    boxCollider: {
      offsetX: 0,
      offsetY: 0,
      width: 6,
      height: 8,
    },
    frame: {
      sourceX: 0,
      sourceY: 8,
      frameWidth: 6,
      frameHeight: 8,
    },
  },
  player: {
    boxCollider: {
      offsetX: 1,
      offsetY: 0,
      width: 6,
      height: 8,
    },
    idle: {
      sourceX: 16,
      sourceY: 0,
      frameWidth: 8,
      frameHeight: 8,
    },
    bankLeft: {
      sourceX: 8,
      sourceY: 0,
      frameWidth: 8,
      frameHeight: 8,
    },
    bankRight: {
      sourceX: 24,
      sourceY: 0,
      frameWidth: 8,
      frameHeight: 8,
    },
    thruster: {
      sourceX: 40,
      sourceY: 0,
      frameWidth: 8,
      frameHeight: 8,
      animations: {
        thrust: {
          sourceX: 40,
          sourceY: 0,
          width: 40,
          height: 8,
          frameWidth: 8,
          frameHeight: 8,
        },
      },
    },
  },
} as const;

export type SpriteSheet = typeof SpriteSheet;
