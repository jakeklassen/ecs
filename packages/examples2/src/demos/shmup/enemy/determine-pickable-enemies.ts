import { SetRequired } from 'type-fest';
import { sortEntitiesByPosition } from '../entity/sort-entities-by-position.js';
import { Entity } from '../entity.js';

export function determinePickableEnemies<
  T extends SetRequired<Entity, 'transform'>,
>(entities: ReadonlySet<T>) {
  return sortEntitiesByPosition(
    Array.from(entities).filter((entity) => entity.enemyState === 'protect'),
  );
}
