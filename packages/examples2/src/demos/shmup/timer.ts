export class TimeSpan {
  #duration: number;
  #elapsed: number;

  constructor(durationMs: number, elapsed = 0) {
    this.#duration = durationMs / 1000;
    this.#elapsed = elapsed;
  }

  public get expired() {
    return this.#elapsed >= this.#duration;
  }

  update(dt: number) {
    this.#elapsed += dt;
  }
}

export class Timer {
  #timers = new Map<TimeSpan, () => void>();

  add(time: TimeSpan, callback: () => void) {
    this.#timers.set(time, callback);
  }

  remove(time: TimeSpan) {
    this.#timers.delete(time);
  }

  clear() {
    this.#timers.clear();
  }

  update(dt: number) {
    for (const [time, callback] of this.#timers) {
      time.update(dt);

      if (time.expired) {
        callback();

        this.#timers.delete(time);
      }
    }
  }
}
