import { Controls } from '../controls.js';
import { GameEvent } from '../game-events.js';
import { Scene } from '../scene.js';

export function triggerGameOverSystemFactory({
  input,
  scene,
}: {
  input: Controls;
  scene: Scene;
}) {
  return function triggerGameOverSystem() {
    if (input.quit.query()) {
      scene.emit(GameEvent.GameOver);
    }
  };
}
