import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function trackPlayerSystemFactory(world: World<Entity>) {
  const movables = world.archetype('trackPlayer', 'transform');
  const players = world.archetype('tagPlayer', 'transform');

  return (_dt: number) => {
    for (const player of players.entities) {
      for (const entity of movables.entities) {
        entity.transform.position.x =
          player.transform.position.x + (entity.trackPlayer.offset?.x ?? 0);
        entity.transform.position.y =
          player.transform.position.y + (entity.trackPlayer.offset?.y ?? 0);
      }
    }
  };
}
