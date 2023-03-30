export const gameState = {
  cherries: 0,
  score: 0,
  lives: [1, 1, 1, 1],
  paused: false,
  gameOver: false,
};

export const resetGameState = (gameState: GameState) => {
  gameState.cherries = 0;
  gameState.score = 0;
  gameState.lives = [1, 1, 1, 1];
  gameState.paused = false;
  gameState.gameOver = false;
};

export type GameState = typeof gameState;
