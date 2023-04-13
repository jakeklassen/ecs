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
  titleLogo: {
    frame: {
      sourceX: 32,
      sourceY: 104,
      width: 95,
      height: 14,
    },
  },

  enemies: {
    greenAlien: {
      boxCollider: {
        offsetX: 0,
        offsetY: 0,
        width: 8,
        height: 8,
      },
      frame: {
        sourceX: 40,
        sourceY: 8,
        width: 8,
        height: 8,
      },
      animations: {
        idle: {
          sourceX: 40,
          sourceY: 8,
          width: 32,
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
        sourceX: 24,
        sourceY: 120,
        width: 3,
        height: 5,
      },
    },
    one: {
      frame: {
        sourceX: 28,
        sourceY: 120,
        width: 2,
        height: 5,
      },
    },
    two: {
      frame: {
        sourceX: 31,
        sourceY: 120,
        width: 3,
        height: 5,
      },
    },
    three: {
      frame: {
        sourceX: 35,
        sourceY: 120,
        width: 3,
        height: 5,
      },
    },
    four: {
      frame: {
        sourceX: 39,
        sourceY: 120,
        width: 3,
        height: 5,
      },
    },
    five: {
      frame: {
        sourceX: 43,
        sourceY: 120,
        width: 3,
        height: 5,
      },
    },
    six: {
      frame: {
        sourceX: 47,
        sourceY: 120,
        width: 3,
        height: 5,
      },
    },
    seven: {
      frame: {
        sourceX: 51,
        sourceY: 120,
        width: 3,
        height: 5,
      },
    },
    eight: {
      frame: {
        sourceX: 55,
        sourceY: 120,
        width: 3,
        height: 5,
      },
    },
    nine: {
      frame: {
        sourceX: 59,
        sourceY: 120,
        width: 3,
        height: 5,
      },
    },

    interactToBegin: {
      frame: {
        sourceX: 0,
        sourceY: 144,
        width: 67,
        height: 5,
      },
      animations: {
        blink: {
          sourceX: 0,
          sourceY: 144,
          width: 67,
          height: 15,
          frameWidth: 67,
          frameHeight: 5,
        },
      },
    },
    score: {
      frame: {
        sourceX: 0,
        sourceY: 120,
        width: 24,
        height: 5,
      },
    },
    gameOver: {
      frame: {
        sourceX: 0,
        sourceY: 136,
        width: 35,
        height: 5,
      },
    },
    shortShwaveShmup: {
      frame: {
        sourceX: 0,
        sourceY: 128,
        width: 71,
        height: 5,
      },
    },
    pressAnyKeyToStart: {
      frame: {
        sourceX: 0,
        sourceY: 160,
        width: 87,
        height: 5,
      },
      animations: {
        blink: {
          sourceX: 0,
          sourceY: 160,
          width: 87,
          height: 15,
          frameWidth: 87,
          frameHeight: 5,
        },
      },
    },
    v1: {
      frame: {
        sourceX: 64,
        sourceY: 120,
        width: 9,
        height: 5,
      },
    },
  },
} as const;

export type SpriteSheet = typeof SpriteSheet;
