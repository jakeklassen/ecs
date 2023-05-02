import { SetRequired } from 'type-fest';
import { Entity } from '../entity.js';

export function ttlFactory(
  opts: SetRequired<Partial<NonNullable<Entity['ttl']>>, 'durationMs'>,
): NonNullable<Entity['ttl']> {
  return {
    durationMs: opts.durationMs,
    elapsedMs: opts.elapsedMs ?? 0,
    onComplete: opts.onComplete ?? 'entity:destroy',
  };
}
