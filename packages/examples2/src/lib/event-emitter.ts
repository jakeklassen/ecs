export class EventEmitter<
  T extends Record<string, (...args: any) => any>,
> extends Map<keyof T, T[keyof T][]> {
  public on<K extends keyof T>(event: K, listener: T[K]) {
    if (!this.has(event)) {
      this.set(event, []);
    }

    this.get(event)?.push(listener);
  }

  public off<K extends keyof T>(event: K, listener: T[K]) {
    if (!this.has(event)) {
      return;
    }

    const listeners = this.get(event) ?? [];
    const index = listeners.indexOf(listener);

    if (index === -1) {
      return;
    }

    listeners.splice(index, 1);
  }

  public emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
    if (!this.has(event)) {
      return;
    }

    for (const listener of this.get(event) ?? []) {
      listener(args);
    }
  }
}
