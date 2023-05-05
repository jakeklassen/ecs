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
 * @param radius
 * @param color
 */
export function circ(
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
 * Implementation of the PICO-8 `pal` function.
 *
 * Will return a new ImageData object with the palette applied.
 */
export function pal(
  sprite: HTMLImageElement,
  colors: Array<[from: `#${string}`, to: `#${string}`]>,
) {
  // Create a new ImageData object from the sprite
  const canvas = document.createElement('canvas');
  canvas.width = sprite.width;
  canvas.height = sprite.height;

  const context = canvas.getContext('2d')!;
  context.imageSmoothingEnabled = false;

  context.drawImage(sprite, 0, 0);

  // Get the image data from the canvas
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Loop through each pixel and swap its color based on the palette
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a === 0) {
      // Skip transparent pixels
      continue;
    }

    // Find the corresponding "to" color in the palette for the pixel's "from" color
    let swapColor = null;

    for (const [fromColorStr, toColorStr] of colors) {
      const fromColor = parseInt(fromColorStr.slice(1), 16);
      const toColor = parseInt(toColorStr.slice(1), 16);

      if (fromColor === ((r << 16) | (g << 8) | b)) {
        swapColor = toColor;
        break;
      }
    }

    if (swapColor !== null) {
      // Swap the pixel's color to the corresponding "to" color in the palette
      pixels[i] = (swapColor >> 16) & 0xff;
      pixels[i + 1] = (swapColor >> 8) & 0xff;
      pixels[i + 2] = swapColor & 0xff;
    }
  }

  // Put the modified image data back onto the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.putImageData(imageData, 0, 0);

  return canvas;
}
