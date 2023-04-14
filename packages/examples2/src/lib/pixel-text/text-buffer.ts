import { obtainCanvas2dContext } from '../dom.js';
import { loadFont } from './load-font.js';

interface ITextBufferOptions {
  color?: string;
  font: Awaited<ReturnType<typeof loadFont>>;
  text: string;
}

export class TextBuffer {
  bufferCanvas: OffscreenCanvas;
  buffer: OffscreenCanvasRenderingContext2D;
  outputCanvas: OffscreenCanvas;
  output: OffscreenCanvasRenderingContext2D;

  color: string;
  previousColor: string;

  previousScale = 1;
  scale = 1;

  previousText = '';
  text: string;

  font: Awaited<ReturnType<typeof loadFont>>;

  constructor(options: ITextBufferOptions) {
    this.text = options.text;
    this.color = options.color ?? 'white';
    this.previousColor = this.color;
    this.font = options.font;

    const bufferCanvasEl = document.createElement('canvas');
    this.bufferCanvas = bufferCanvasEl.transferControlToOffscreen();
    this.buffer = obtainCanvas2dContext(this.bufferCanvas);

    const outputCanvasEl = document.createElement('canvas');
    this.outputCanvas = outputCanvasEl.transferControlToOffscreen();
    this.output = obtainCanvas2dContext(this.outputCanvas);

    this.updateText(this.text);
  }

  public get renderable() {
    return this.outputCanvas;
  }

  checkBufferSize(width: number, height: number) {
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

  updateText(text: string, drawOptions?: { color?: string; scale?: number }) {
    this.text = text;
    this.scale = drawOptions?.scale ?? this.scale;
    this.color = drawOptions?.color ?? this.color;

    if (
      text === this.previousText &&
      this.color === this.previousColor &&
      this.scale === this.previousScale
    ) {
      return;
    }

    this.previousText = text;
    this.previousColor = this.color;
    this.previousScale = this.scale;

    let width = 0;
    for (const c of text) {
      const char = this.font.characters[c];

      if (char) {
        width += char.width * this.scale;
      }
    }

    this.checkBufferSize(width, this.font.height * this.scale);

    let x = 0;
    for (const c of text) {
      const char = this.font.characters[c];

      if (char) {
        this.drawChar(x, char, this.scale);
        x += char.width * this.scale;
      }
    }
  }

  drawChar(
    x: number,
    char: ITextBufferOptions['font']['characters'][string],
    scale: number,
  ) {
    const offsetX = x + char.offset[0] * scale;
    const offsetY = char.offset[1] * scale;
    const charWidth = char.rect[2] * scale;
    const charHeight = char.rect[3] * scale;

    this.buffer.imageSmoothingEnabled = false;
    this.output.imageSmoothingEnabled = false;

    this.buffer.drawImage(
      this.font.image,
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
