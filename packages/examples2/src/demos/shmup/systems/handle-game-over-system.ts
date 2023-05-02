import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { GameEvent } from '../game-events.js';
import { Scene } from '../scene.js';

export function handleGameOverSystemFactory({
  scene,
  world,
}: {
  scene: Scene;
  world: World<Entity>;
}) {
  const events = world.archetype('eventGameOver');

  return () => {
    if (events.entities.size === 0) {
      return;
    }

    // We know we received the game over event, so we can delete all entities
    for (const entity of events.entities) {
      world.deleteEntity(entity);
    }

    scene.emit(GameEvent.GameOver);
  };
}
