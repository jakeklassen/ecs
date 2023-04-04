import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function invulnerableSystemFactory({ world }: { world: World<Entity> }) {
  const invulnerables = world.archetype('invulnerable');

  return (dt: number) => {
    for (const entity of invulnerables.entities) {
      const { invulnerable } = entity;

      invulnerable.elapsedMs += dt * 1000;

      if (invulnerable.elapsedMs >= invulnerable.durationMs) {
        world.removeEntityComponents(entity, 'invulnerable');
      }
    }
  };
}
