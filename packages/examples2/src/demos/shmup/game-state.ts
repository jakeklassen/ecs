export const gameState = {
  cherries: 0,
  score: 0,
  lives: 4,
  paused: false,
  gameOver: false,

  reset() {
    this.cherries = 0;
    this.score = 0;
    this.lives = 3;
    this.paused = false;
    this.gameOver = false;
  },
};

export type GameState = typeof gameState;
