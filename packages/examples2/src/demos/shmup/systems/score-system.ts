import { TextBuffer } from '#/lib/pixel-text/text-buffer.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';

export function scoreSystemFactory({
  gameState,
  textCache,
  world,
}: {
  gameState: GameState;
  textCache: Map<Entity, TextBuffer>;
  world: World<Entity>;
}) {
  const scoreTextEntities = world.archetype('tagTextScore', 'text');
  const previousState = structuredClone(gameState);

  return function scoreSystem() {
    if (gameState.score === previousState.score) {
      return;
    }

    previousState.score = gameState.score;

    for (const entity of scoreTextEntities.entities) {
      const textBuffer = textCache.get(entity);

      textBuffer?.updateText(`Score:${gameState.score}`);
    }
  };
}
