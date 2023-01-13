import { SharedEntity } from '../shared-entity.js';

export function colorFactory(
  color: SharedEntity['color'],
): NonNullable<SharedEntity['color']> {
  return color ?? `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
