import { TextBuffer } from '#/lib/pixel-text/text-buffer.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';

export function cherrySystemFactory({
  gameState,
  textCache,
  world,
}: {
  gameState: GameState;
  textCache: Map<Entity, TextBuffer>;
  world: World<Entity>;
}) {
  const cherryTextEntities = world.archetype('tagTextCherries', 'text');
  const previousState = structuredClone(gameState);

  return () => {
    if (gameState.cherries === previousState.cherries) {
      return;
    }

    previousState.cherries = gameState.cherries;

    for (const entity of cherryTextEntities.entities) {
      const textBuffer = textCache.get(entity);

      textBuffer?.updateText(`${gameState.cherries}`);
    }
  };
}
