import { World } from '@jakeklassen/ecs2';
import { GameEvent } from '../game-events.js';
import { GameState } from '../game-state.js';
import { Scene } from '../scene.js';
import { Entity } from '../entity.js';

export function handleGameOverSystemFactory({
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
    // the game over scene.
    if (gameState.lives <= 0 && particles.entities.size === 0) {
      scene.emit(GameEvent.GameOver);
    }
  };
}
