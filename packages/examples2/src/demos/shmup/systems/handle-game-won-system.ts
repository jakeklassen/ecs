import { World } from '@jakeklassen/ecs2';
import { GameEvent } from '../game-events.js';
import { GameState } from '../game-state.js';
import { Scene } from '../scene.js';
import { Entity } from '../entity.js';

export function handleGameWonSystemFactory({
  gameState,
  scene,
  world,
}: {
  gameState: GameState;
  scene: Scene;
  world: World<Entity>;
}) {
  const particles = world.archetype('particle');

  return () => {
    // We want to let particles finish their animation before we switch to
    // the game won scene.
    if (gameState.wave > gameState.maxWaves && particles.entities.size === 0) {
      scene.emit(GameEvent.GameWon);
    }
  };
}
