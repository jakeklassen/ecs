import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function yellowShipSystemFactory({ world }: { world: World<Entity> }) {
  const yellowShips = world.archetype('tagYellowShip', 'transform', 'velocity');

  return () => {
    for (const yellowShip of yellowShips.entities) {
      if (yellowShip.transform.position.y > 110) {
        yellowShip.velocity.y = 30;
      }
    }
  };
}
