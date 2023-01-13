export const Easing = {
  Linear: 'linear',
} as const;

export const easeLinear = (
  time: number,
  start: number,
  change: number,
  duration: number,
): number => (change * time) / duration + start;
