export class TimeSpan {
  #duration: number;
  #elapsed: number;

  constructor(duration: number, elapsed = 0) {
    this.#duration = duration;
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
