import { Controls } from '../controls.js';
import { GameEvent } from '../game-events.js';
import { Scene } from '../scene.js';

export function startGameSystemFactory(controls: Controls, scene: Scene) {
  return (_dt: number) => {
    if (controls.confirm.query()) {
      console.log('start game');
      scene.emit(GameEvent.StartGame);
    }
  };
}
