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
  return (_dt: number) => {
    if (controls.confirm.query()) {
      scene.emit(GameEvent.StartGame);
    }
  };
}
