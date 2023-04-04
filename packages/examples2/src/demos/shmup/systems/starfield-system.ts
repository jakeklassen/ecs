import { rndInt } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function starfieldSystemFactory({ world }: { world: World<Entity> }) {
  const stars = world.archetype('star', 'transform');

  return (_dt: number) => {
    for (const { transform } of stars.entities) {
      if (transform.position.y > 128) {
        transform.position.y = -1;
        transform.position.x = rndInt(127, 1);
      }
    }
  };
}
