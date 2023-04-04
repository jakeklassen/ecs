export const gameState = {
  cherries: 0,
  score: 0,
  lives: 4,
  maxLives: 4,
  paused: false,
  gameOver: false,
};

export const resetGameState = (gameState: GameState) => {
  gameState.cherries = 0;
  gameState.score = 0;
  gameState.lives = gameState.maxLives;
  gameState.paused = false;
  gameState.gameOver = false;
};

export type GameState = typeof gameState;
