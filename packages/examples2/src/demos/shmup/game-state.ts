export const gameState = {
  cherries: 0,
  score: 0,
  lives: 1,
  maxLives: 4,
  paused: false,
  gameOver: false,
  wave: 0,
  maxWaves: 9,
};

export const resetGameState = (gameState: GameState) => {
  gameState.cherries = 0;
  gameState.score = 0;
  gameState.lives = gameState.maxLives;
  gameState.paused = false;
  gameState.gameOver = false;
  gameState.wave = 8;
};

export type GameState = typeof gameState;
