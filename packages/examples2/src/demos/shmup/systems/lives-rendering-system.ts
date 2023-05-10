import { LoadedContent } from '../content.js';
import { GameState } from '../game-state.js';

export function livesRenderingSystemFactory({
  gameState,
  content,
  context,
}: {
  gameState: GameState;
  content: LoadedContent;
  context: CanvasRenderingContext2D;
}) {
  return function livesRenderingSystem() {
    for (let i = 0; i < gameState.maxLives; i++) {
      if (i < gameState.lives) {
        context.drawImage(content.sprite.hud.heartFull, (i + 1) * 9 - 8, 1);
      } else {
        context.drawImage(content.sprite.hud.heartEmpty, (i + 1) * 9 - 8, 1);
      }
    }
  };
}
