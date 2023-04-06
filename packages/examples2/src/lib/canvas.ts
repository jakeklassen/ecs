/**
 * Implementation of the PICO-8 `circfill` function
 * @param context
 * @param x
 * @param y
 * @param radius
 * @param color
 */
export function fillCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
) {
  let x1 = 0;
  let y1 = radius;
  let diameter = 3 - 2 * radius;

  while (x1 <= y1) {
    // Draw horizontal lines of the circle
    for (let i = -x1; i <= x1; i++) {
      context.fillStyle = color;
      context.fillRect(x + i, y + y1, 1, 1);
      context.fillRect(x + i, y - y1, 1, 1);
    }

    // Draw vertical lines of the circle
    for (let i = -y1; i <= y1; i++) {
      context.fillStyle = color;
      context.fillRect(x + i, y + x1, 1, 1);
      context.fillRect(x + i, y - x1, 1, 1);
    }

    if (diameter < 0) {
      diameter = diameter + 4 * x1 + 6;
    } else {
      diameter = diameter + 4 * (x1 - y1) + 10;
      y1--;
    }

    x1++;
  }
}
