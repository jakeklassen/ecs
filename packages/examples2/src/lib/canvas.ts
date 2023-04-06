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

/**
 * Implementation of the PICO-8 `circ` function
 * @param context
 * @param x
 * @param y
 * @param r
 * @param color
 */
export function circ(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  let x1 = 0;
  let y1 = r;
  let d = 3 - 2 * r;
  while (x1 <= y1) {
    // Plot points along the circumference of the circle
    context.fillStyle = color;
    context.fillRect(x + x1, y + y1, 1, 1);
    context.fillRect(x - x1, y + y1, 1, 1);
    context.fillRect(x + x1, y - y1, 1, 1);
    context.fillRect(x - x1, y - y1, 1, 1);
    context.fillRect(x + y1, y + x1, 1, 1);
    context.fillRect(x - y1, y + x1, 1, 1);
    context.fillRect(x + y1, y - x1, 1, 1);
    context.fillRect(x - y1, y - x1, 1, 1);
    if (d < 0) {
      d = d + 4 * x1 + 6;
    } else {
      d = d + 4 * (x1 - y1) + 10;
      y1--;
    }
    x1++;
  }
}
