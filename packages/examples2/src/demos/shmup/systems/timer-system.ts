import { Timer } from '../timer.js';

export function timerSystemFactory({ timer }: { timer: Timer }) {
  return (dt: number) => {
    timer.update(dt);
  };
}
