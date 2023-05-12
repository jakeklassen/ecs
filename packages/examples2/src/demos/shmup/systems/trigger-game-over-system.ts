import { GameEvent } from '../game-events.js';
import { Input } from '../input.js';
import { Scene } from '../scene.js';

export function triggerGameOverSystemFactory({
  input,
  scene,
}: {
  input: Input;
  scene: Scene;
}) {
  return function triggerGameOverSystem() {
    if (input.quit.query()) {
      scene.emit(GameEvent.GameOver);
    }
  };
}
