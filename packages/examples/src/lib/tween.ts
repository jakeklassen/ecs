export enum Easing {
  Linear = 'linear',
}

export const easeLinear = (
  time: number,
  start: number,
  change: number,
  duration: number,
): number => (change * time) / duration + start;
