import { Controls } from '../controls.js';
import { GameEvent } from '../game-events.js';
import { Scene } from '../scene.js';

export function triggerGameWonSystemFactory({
  input,
  scene,
}: {
  input: Controls;
  scene: Scene;
}) {
  return (_dt: number) => {
    if (input.win.query()) {
      scene.emit(GameEvent.GameWon);
    }
  };
}
