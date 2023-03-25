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
      width: 6,
      height: 8,
    },
  },
  cherry: {
    frame: {
      sourceX: 0,
      sourceY: 24,
      width: 8,
      height: 8,
    },
  },
  heart: {
    full: {
      frame: {
        sourceX: 104,
        sourceY: 0,
        width: 8,
        height: 8,
      },
    },
    empty: {
      frame: {
        sourceX: 112,
        sourceY: 0,
        width: 8,
        height: 8,
      },
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
      width: 8,
      height: 8,
    },
    bankLeft: {
      sourceX: 8,
      sourceY: 0,
      width: 8,
      height: 8,
    },
    bankRight: {
      sourceX: 24,
      sourceY: 0,
      width: 8,
      height: 8,
    },
    thruster: {
      sourceX: 40,
      sourceY: 0,
      width: 8,
      height: 8,
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

  text: {
    zero: {
      frame: {
        sourceX: 0,
        sourceY: 152,
        width: 4,
        height: 5,
      },
    },
    one: {
      frame: {
        sourceX: 6,
        sourceY: 152,
        width: 2,
        height: 5,
      },
    },
    two: {
      frame: {
        sourceX: 10,
        sourceY: 152,
        width: 4,
        height: 5,
      },
    },
    three: {
      frame: {
        sourceX: 15,
        sourceY: 152,
        width: 4,
        height: 5,
      },
    },
    four: {
      frame: {
        sourceX: 20,
        sourceY: 152,
        width: 4,
        height: 5,
      },
    },
    five: {
      frame: {
        sourceX: 25,
        sourceY: 152,
        width: 4,
        height: 5,
      },
    },
    six: {
      frame: {
        sourceX: 30,
        sourceY: 152,
        width: 4,
        height: 5,
      },
    },
    seven: {
      frame: {
        sourceX: 35,
        sourceY: 152,
        width: 4,
        height: 5,
      },
    },
    eight: {
      frame: {
        sourceX: 40,
        sourceY: 152,
        width: 4,
        height: 5,
      },
    },
    nine: {
      frame: {
        sourceX: 45,
        sourceY: 152,
        width: 4,
        height: 5,
      },
    },

    score: {
      sourceX: 32,
      sourceY: 128,
      width: 51,
      height: 5,
    },
  },
} as const;

export type SpriteSheet = typeof SpriteSheet;
