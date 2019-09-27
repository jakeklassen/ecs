export type Handler = (...args: any[]) => void;

/**
 * @example
 * const CollisionEventKey = Symbol.for('collision');
 * type CollisionEventHandler = (a: Entity, b: Entity) => void;
 *
 * const emitter = new EventEmitter();
 * emitter.on<CollisionEventHandler>(CollisionEventKey, (a: Entity, b: Entity) => {
 *   // do stuff
 * });
 */
export class EventEmitter {
  private listeners = new Map<symbol, Set<Handler>>();

  public on<T extends Handler>(key: symbol, handler: T) {
    if (this.listeners.has(key)) {
      this.listeners.get(key)!.add(handler);
    } else {
      this.listeners.set(key, new Set([handler]));
    }
  }

  public emit(key: symbol, ...args: any[]) {
    if (this.listeners.has(key) === false) {
      return;
    }

    this.listeners.get(key)!.forEach(handler => handler(...args));
  }

  public off(key: symbol, handler: Handler) {
    if (this.listeners.has(key) === false) {
      return false;
    }

    return this.listeners.get(key)!.delete(handler);
  }
}
