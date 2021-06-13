import { performance } from 'perf_hooks';

export const time = (fn: () => void, iterations = 10): number => {
  const times: number[] = [];

  Array.from({ length: iterations }).forEach(() => {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  });

  return parseFloat(
    (times.reduce((acc, time) => acc + time, 0) / times.length).toFixed(6),
  );
};
