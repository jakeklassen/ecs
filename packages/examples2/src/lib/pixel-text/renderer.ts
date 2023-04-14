import { obtainCanvas2dContext } from '../dom.js';
import { loadFont } from './load-font.js';

type ColorSymbol =
  | '🔵'
  | '⚪'
  | '🔴'
  | '🟠'
  | '🟣'
  | '🟤'
  | '🟡'
  | '🟢'
  | '⚫'
  | (string & {});

interface IRendererOptions {
  color?: string;
  colorSymbols?: Record<ColorSymbol, string>;
  canvas: HTMLCanvasElement;
  font: Awaited<ReturnType<typeof loadFont>>;
}

const colorSymbols = {
  '🔵': 'blue',
  '⚪': 'white',
  '🔴': 'red',
  '🟠': 'orange',
  '🟣': 'purple',
  '🟤': 'brown',
  '🟡': 'yellow',
  '🟢': 'green',
  '⚫': 'black',
};

export class Renderer {
  options: Required<IRendererOptions>;

  bufferCanvas: OffscreenCanvas;
  buffer: OffscreenCanvasRenderingContext2D;
  outputCanvas: OffscreenCanvas;
  output: OffscreenCanvasRenderingContext2D;
  context: CanvasRenderingContext2D;
  color: string;
  previousText = '';

  constructor(options: IRendererOptions) {
    this.options = {
      ...{ color: 'white', colorSymbols },
      ...options,
    };

    this.color = this.options.color;

    this.context = obtainCanvas2dContext(this.options.canvas);

    const bufferCanvasEl = document.createElement('canvas');
    this.bufferCanvas = bufferCanvasEl.transferControlToOffscreen();
    this.buffer = obtainCanvas2dContext(this.bufferCanvas);

    const outputCanvasEl = document.createElement('canvas');
    this.outputCanvas = outputCanvasEl.transferControlToOffscreen();
    this.output = obtainCanvas2dContext(this.outputCanvas);

    this.checkBufferSize();
  }

  checkBufferSize() {
    const { width, height } = this.options.canvas;

    if (this.bufferCanvas.width !== width) {
      this.bufferCanvas.width = width;
    }

    if (this.bufferCanvas.height !== height) {
      this.bufferCanvas.height = height;
    }

    if (this.outputCanvas.width !== width) {
      this.outputCanvas.width = width;
    }

    if (this.outputCanvas.height !== height) {
      this.outputCanvas.height = height;
    }
  }

  draw(
    x: number,
    y: number,
    text: string,
    _drawOptions?: { scale?: number; color?: string },
  ) {
    if (text === this.previousText) {
      this.context.drawImage(this.outputCanvas, 0, 0);

      return;
    }

    this.previousText = text;

    this.checkBufferSize();

    const drawOptions = {
      scale: _drawOptions?.scale ?? 1,
    };

    this.color = _drawOptions?.color ?? this.options.color;

    for (const c of text) {
      const char = this.options.font.characters[c];

      if (char) {
        this.drawChar(x, y, char, drawOptions.scale);
        x += char.width * drawOptions.scale;
      }

      // Come back to this.
      // It would be cool to support stuff like '🔴Score: 🔵1234'.
      // But I want it for any color, not just the ones supported in unicode.
      // else if (color) {
      //   this.color = color;
      // }
    }
  }

  drawChar(
    x: number,
    y: number,
    char: IRendererOptions['font']['characters'][string],
    scale: number,
  ) {
    const offsetX = x + char.offset[0] * scale;
    const offsetY = y + char.offset[1] * scale;
    const charWidth = char.rect[2] * scale;
    const charHeight = char.rect[3] * scale;

    this.buffer.imageSmoothingEnabled = false;
    this.output.imageSmoothingEnabled = false;

    this.buffer.drawImage(
      this.options.font.image,
      char.rect[0],
      char.rect[1],
      char.rect[2],
      char.rect[3],
      offsetX,
      offsetY,
      charWidth,
      charHeight,
    );

    this.buffer.fillStyle = this.color;
    this.buffer.globalCompositeOperation = 'source-in';
    this.buffer.fillRect(offsetX, offsetY, charWidth, charHeight);

    this.buffer.globalCompositeOperation = 'source-over';

    // Write to the output canvas
    this.output.drawImage(
      this.bufferCanvas,
      offsetX,
      offsetY,
      charWidth,
      charHeight,
      offsetX,
      offsetY,
      charWidth,
      charHeight,
    );
  }
}
