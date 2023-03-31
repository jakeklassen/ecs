import { Controls } from '../controls.js';
import { GameEvent } from '../game-events.js';
import { Scene } from '../scene.js';

export function triggerGameOverSystemFactory(input: Controls, scene: Scene) {
  return (_dt: number) => {
    if (input.quit.query()) {
      scene.emit(GameEvent.GameOver);
    }
  };
}
