import { GameEvent } from '../game-events.js';
import { Input } from '../input.js';
import { Scene } from '../scene.js';

export function triggerGameWonSystemFactory({
  input,
  scene,
}: {
  input: Input;
  scene: Scene;
}) {
  return function triggerGameWonSystem() {
    if (input.win.query()) {
      scene.emit(GameEvent.GameWon);
    }
  };
}
