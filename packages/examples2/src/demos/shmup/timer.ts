export class TimeSpan {
  #duration: number;
  #elapsed: number;
  #repeat: boolean;
  #totalElapsed = 0;

  constructor(durationMs: number, elapsed = 0, repeat = false) {
    this.#duration = durationMs / 1000;
    this.#elapsed = elapsed;
    this.#repeat = repeat;
  }

  public get expired() {
    return this.#elapsed >= this.#duration;
  }

  public get repeat() {
    return this.#repeat;
  }

  public get elapsed() {
    return this.#elapsed;
  }

  public get totalElapsed() {
    return this.#totalElapsed;
  }

  update(dt: number) {
    this.#elapsed += dt;
    this.#totalElapsed += dt;
  }

  reset() {
    this.#elapsed = 0;
    this.#totalElapsed = 0;
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

        if (time.repeat) {
          time.reset();
        } else {
          this.#timers.delete(time);
        }
      }
    }
  }
}
