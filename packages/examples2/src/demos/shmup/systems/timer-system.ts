import { Timer } from '../timer.js';

export function timerSystemFactory({ timer }: { timer: Timer }) {
  return function timerSystem(dt: number) {
    timer.update(dt);
  };
}
