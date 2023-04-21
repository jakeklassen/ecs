import { rndInt } from '#/lib/math.js';
import { Entity } from '../entity.js';

export function pickRandomEnemy<T extends Entity>(
  enemies: T[],
  elementsFromLast = enemies.length,
) {
  if (enemies.length === 0) {
    return;
  }

  const max = Math.min(enemies.length, elementsFromLast);
  const randomIndex = rndInt(max, 1);
  const enemyIndex = enemies.length - randomIndex;

  return enemies.at(enemyIndex);
}
