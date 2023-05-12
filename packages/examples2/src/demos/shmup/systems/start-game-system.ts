import { GameEvent } from '../game-events.js';
import { Input } from '../input.js';
import { Scene } from '../scene.js';

export function startGameSystemFactory({
  input,
  scene,
}: {
  input: Input;
  scene: Scene;
}) {
  // Swallow remaining input.
  // This is to prevent the game from starting immediately if the input
  // query still reads as true from the previous scene.
  input.any.query();

  return function startGameSystem() {
    if (input.any.query()) {
      scene.emit(GameEvent.StartGame);
    }
  };
}
