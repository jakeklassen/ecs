import { World } from '@jakeklassen/ecs2';
import { GameState } from '../game-state.js';
import { Entity } from '../entity.js';

export function waveSystemFactory({
  gameState,
  world,
}: {
  gameState: GameState;
  world: World<Entity>;
}) {
  return () => {
    if (gameState.wave === 0) {
    }
  };
}
