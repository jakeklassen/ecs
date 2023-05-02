import { GameEvent } from '../game-events.js';
import { GameState } from '../game-state.js';
import { Scene } from '../scene.js';
import { TimeSpan, Timer } from '../timer.js';

export function handleGameWonSystemFactory({
  gameState,
  scene,
  timer,
}: {
  gameState: GameState;
  scene: Scene;
  timer: Timer;
}) {
  return () => {
    // Delay game over to give animations time to finish
    if (gameState.wave > gameState.maxWaves) {
      timer.add(new TimeSpan(1000), () => {
        scene.emit(GameEvent.GameWon);
      });
    }
  };
}
