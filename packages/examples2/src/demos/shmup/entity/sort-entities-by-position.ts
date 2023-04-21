import { SetRequired } from 'type-fest';
import { Entity } from '../entity.js';

function positionSort(
  a: SetRequired<Entity, 'transform'>,
  b: SetRequired<Entity, 'transform'>,
) {
  if (a.transform.position.y < b.transform.position.y) {
    return -1;
  }

  if (a.transform.position.y > b.transform.position.y) {
    return 1;
  }

  if (a.transform.position.x < b.transform.position.x) {
    return -1;
  }

  if (a.transform.position.x > b.transform.position.x) {
    return 1;
  }

  return 0;
}

export function sortEntitiesByPosition<
  T extends SetRequired<Entity, 'transform'>,
>(entities: ReadonlyArray<T>): T[] {
  const entitiesArray = Array.from(entities);

  return entitiesArray.sort(positionSort);
}
