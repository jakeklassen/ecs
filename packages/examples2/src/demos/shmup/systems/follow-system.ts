import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function followSystemFactory(world: World<Entity>) {
  const movables = world.archetype('target', 'transform');

  return (_dt: number) => {
    for (const entity of movables.entities) {
      entity.transform.position.x =
        entity.target.transform.position.x + (entity.target.offset?.x ?? 0);
      entity.transform.position.y =
        entity.target.transform.position.y + (entity.target.offset?.y ?? 0);
    }
  };
}
