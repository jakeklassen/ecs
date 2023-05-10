import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function timeToLiveSystemFactory({ world }: { world: World<Entity> }) {
  const entities = world.archetype('ttl');

  return function timeToLiveSystem(dt: number) {
    for (const entity of entities.entities) {
      const { ttl } = entity;

      ttl.elapsedMs += dt * 1000;

      if (
        ttl.elapsedMs >= ttl.durationMs &&
        ttl.onComplete === 'entity:destroy'
      ) {
        world.deleteEntity(entity);

        if (ttl.trigger == null) {
          continue;
        }

        if (ttl.trigger.startsWith('nextWave')) {
          const [_event, waveString] = ttl.trigger.split(':');
          const wave = parseInt(waveString, 10);

          world.createEntity({
            eventSpawnWave: {
              waveNumber: wave,
            },
          });
        }
      }
    }
  };
}
