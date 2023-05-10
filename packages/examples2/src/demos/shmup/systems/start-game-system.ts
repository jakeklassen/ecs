import { Controls } from '../controls.js';
import { GameEvent } from '../game-events.js';
import { Scene } from '../scene.js';

export function startGameSystemFactory({
  controls,
  scene,
}: {
  controls: Controls;
  scene: Scene;
}) {
  // Swallow the first press of the confirm button.
  // This is to prevent the game from starting immediately if the input
  // query still reads as true from the previous scene.
  controls.confirm.query();

  return function startGameSystem() {
    if (controls.confirm.query()) {
      scene.emit(GameEvent.StartGame);
    }
  };
}
