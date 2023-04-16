import { obtainCanvasAndContext2d } from '#/lib/dom';
import pico8FontImageUrl from './assets/font/pico-8_regular_5.png';
import pico8FontXmlUrl from './assets/font/pico-8_regular_5.xml?url';
import '../../style.css';
import { loadFont } from '#/lib/pixel-text/load-font.js';
import { Renderer } from '#/lib/pixel-text/renderer.js';
import { TextBuffer } from '#/lib/pixel-text/text-buffer.js';

const { canvas, context } = obtainCanvasAndContext2d('#canvas');

context.imageSmoothingEnabled = false;

const picoFont = await loadFont(pico8FontImageUrl, pico8FontXmlUrl);
const textRenderer = new Renderer({
  font: picoFont,
  canvas,
});

const textElement = new TextBuffer({
  font: picoFont,
  text: 'sup',
});

textElement.updateText('sup', {
  color: 'green',
});

const TARGET_FPS = 60;
const STEP = 1000 / TARGET_FPS;
// @ts-ignore
const dt = STEP / 1000;
// @ts-ignore
let variableDt = 0;
let last = performance.now();
let deltaTimeAccumulator = 0;

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  deltaTimeAccumulator += Math.min(1000, hrt - last);
  variableDt = (hrt - last) / 1000;

  while (deltaTimeAccumulator >= STEP) {
    deltaTimeAccumulator -= STEP;
  }

  // textRenderer.draw(0, 0, 'Hello, world!');
  textRenderer.draw(0, 10, 'Score: 1231', { color: '#FFA300' });

  textElement.updateText(`HRT: ${hrt}`);
  context.drawImage(textElement.renderable, 0, 0);

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
