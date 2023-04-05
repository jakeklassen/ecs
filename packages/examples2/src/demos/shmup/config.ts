export const config = {
  debug: false,

  entities: {
    enemies: {
      greenAlien: {
        startingHealth: 3,
      },
    },
    player: {
      spawnPosition: {
        x: 60,
        y: 110,
      },
    },
  },

  /**
   * In pixels
   */
  gameWidth: 128,

  /**
   * In pixels
   */
  gameHeight: 128,
};

export type Config = typeof config;
