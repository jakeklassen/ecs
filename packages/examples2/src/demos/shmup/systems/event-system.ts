import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';
import { rndInt } from '#/lib/math.js';

export function eventSystemFactory({ world }: { world: World<Entity> }) {
  const events = world.archetype('event');

  return () => {
    const entitiesToDelete = [];

    for (const entity of events.entities) {
      const { event } = entity;

      switch (event.type) {
        case 'TweenEnd': {
          const { entity } = event;

          if (
            entity.tagStartScreenGreenAlien === true &&
            entity.transform != null
          ) {
            entity.transform.position.x = 30 + rndInt(60);
          }

          break;
        }
      }

      entitiesToDelete.push(entity);
    }

    for (const entity of entitiesToDelete) {
      world.deleteEntity(entity);
    }
  };
}
