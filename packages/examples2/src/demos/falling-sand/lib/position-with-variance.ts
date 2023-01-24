export const positionWithVariance = (
  x: number,
  y: number,
  radius = 2,
  probability = 1.0,
) => {
  let radiusSq = radius * radius;

  for (let y1 = -radius; y1 <= radius; y1++) {
    for (let x1 = -radius; x1 <= radius; x1++) {
      if (x1 * x1 + y1 * y1 <= radiusSq && Math.random() < probability) {
        return {
          x: x + x1,
          y: y + y1,
        };
      }
    }
  }

  return {
    x,
    y,
  };
};
