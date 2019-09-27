/**
 * @example
 * export const CollisionEventKey = Symbol.for('collision');
 * type CollisionEventHandler = (a: Entity, b: Entity) => void;
 *
 * const ee = new EventEmitter();
 * ee.on<CollisionEventHandler>(CollisionEventKey, (a: Entity, b: Entity) => {});
 */
export class EventEmitter {
  public on<T extends (...args: any[]) => void>(key: symbol, handler: T) {}
}

// Imagine `world` being the real event emitter in the end.
// world.events.on(...)
