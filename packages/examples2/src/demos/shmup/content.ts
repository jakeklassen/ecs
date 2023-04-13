import { loadImage } from '#/lib/asset-loader.js';
import { obtainCanvas2dContext } from '#/lib/dom.js';
import { SpriteSheet } from './spritesheet';

export type LoadedContent = Awaited<ReturnType<typeof Content.load>>;

export class Content {
  public static async load(spriteSheetUrl: string) {
    const spriteSheet = await loadImage(spriteSheetUrl);

    const canvas = document.createElement('canvas');
    const ctx = obtainCanvas2dContext(canvas);
    ctx.imageSmoothingEnabled = false;

    // Spritesheet
    canvas.width = spriteSheet.width;
    canvas.height = spriteSheet.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(spriteSheet, 0, 0);

    const spritesheet = await loadImage(canvas.toDataURL());

    // Numberic text

    // 0
    canvas.width = SpriteSheet.text.zero.frame.width;
    canvas.height = SpriteSheet.text.zero.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.zero.frame.sourceX,
      SpriteSheet.text.zero.frame.sourceY,
      SpriteSheet.text.zero.frame.width,
      SpriteSheet.text.zero.frame.height,
      0,
      0,
      SpriteSheet.text.zero.frame.width,
      SpriteSheet.text.zero.frame.height,
    );

    const zero = await loadImage(canvas.toDataURL());

    // 1
    canvas.width = SpriteSheet.text.one.frame.width;
    canvas.height = SpriteSheet.text.one.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.one.frame.sourceX,
      SpriteSheet.text.one.frame.sourceY,
      SpriteSheet.text.one.frame.width,
      SpriteSheet.text.one.frame.height,
      0,
      0,
      SpriteSheet.text.one.frame.width,
      SpriteSheet.text.one.frame.height,
    );

    const one = await loadImage(canvas.toDataURL());

    // 2
    canvas.width = SpriteSheet.text.two.frame.width;
    canvas.height = SpriteSheet.text.two.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.two.frame.sourceX,
      SpriteSheet.text.two.frame.sourceY,
      SpriteSheet.text.two.frame.width,
      SpriteSheet.text.two.frame.height,
      0,
      0,
      SpriteSheet.text.two.frame.width,
      SpriteSheet.text.two.frame.height,
    );

    const two = await loadImage(canvas.toDataURL());

    // 3
    canvas.width = SpriteSheet.text.three.frame.width;
    canvas.height = SpriteSheet.text.three.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.three.frame.sourceX,
      SpriteSheet.text.three.frame.sourceY,
      SpriteSheet.text.three.frame.width,
      SpriteSheet.text.three.frame.height,
      0,
      0,
      SpriteSheet.text.three.frame.width,
      SpriteSheet.text.three.frame.height,
    );

    const three = await loadImage(canvas.toDataURL());

    // 4
    canvas.width = SpriteSheet.text.four.frame.width;
    canvas.height = SpriteSheet.text.four.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.four.frame.sourceX,
      SpriteSheet.text.four.frame.sourceY,
      SpriteSheet.text.four.frame.width,
      SpriteSheet.text.four.frame.height,
      0,
      0,
      SpriteSheet.text.four.frame.width,
      SpriteSheet.text.four.frame.height,
    );

    const four = await loadImage(canvas.toDataURL());

    // 5
    canvas.width = SpriteSheet.text.five.frame.width;
    canvas.height = SpriteSheet.text.five.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.five.frame.sourceX,
      SpriteSheet.text.five.frame.sourceY,
      SpriteSheet.text.five.frame.width,
      SpriteSheet.text.five.frame.height,
      0,
      0,
      SpriteSheet.text.five.frame.width,
      SpriteSheet.text.five.frame.height,
    );

    const five = await loadImage(canvas.toDataURL());

    // 6
    canvas.width = SpriteSheet.text.six.frame.width;
    canvas.height = SpriteSheet.text.six.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.six.frame.sourceX,
      SpriteSheet.text.six.frame.sourceY,
      SpriteSheet.text.six.frame.width,
      SpriteSheet.text.six.frame.height,
      0,
      0,
      SpriteSheet.text.six.frame.width,
      SpriteSheet.text.six.frame.height,
    );

    const six = await loadImage(canvas.toDataURL());

    // 7
    canvas.width = SpriteSheet.text.seven.frame.width;
    canvas.height = SpriteSheet.text.seven.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.seven.frame.sourceX,
      SpriteSheet.text.seven.frame.sourceY,
      SpriteSheet.text.seven.frame.width,
      SpriteSheet.text.seven.frame.height,
      0,
      0,
      SpriteSheet.text.seven.frame.width,
      SpriteSheet.text.seven.frame.height,
    );

    const seven = await loadImage(canvas.toDataURL());

    // 8
    canvas.width = SpriteSheet.text.eight.frame.width;
    canvas.height = SpriteSheet.text.eight.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.eight.frame.sourceX,
      SpriteSheet.text.eight.frame.sourceY,
      SpriteSheet.text.eight.frame.width,
      SpriteSheet.text.eight.frame.height,
      0,
      0,
      SpriteSheet.text.eight.frame.width,
      SpriteSheet.text.eight.frame.height,
    );

    const eight = await loadImage(canvas.toDataURL());

    // 9
    canvas.width = SpriteSheet.text.nine.frame.width;
    canvas.height = SpriteSheet.text.nine.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.nine.frame.sourceX,
      SpriteSheet.text.nine.frame.sourceY,
      SpriteSheet.text.nine.frame.width,
      SpriteSheet.text.nine.frame.height,
      0,
      0,
      SpriteSheet.text.nine.frame.width,
      SpriteSheet.text.nine.frame.height,
    );

    const nine = await loadImage(canvas.toDataURL());

    // score: text
    canvas.width = SpriteSheet.text.score.frame.width;
    canvas.height = SpriteSheet.text.score.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.text.score.frame.sourceX,
      SpriteSheet.text.score.frame.sourceY,
      SpriteSheet.text.score.frame.width,
      SpriteSheet.text.score.frame.height,
      0,
      0,
      SpriteSheet.text.score.frame.width,
      SpriteSheet.text.score.frame.height,
    );

    const score = await loadImage(canvas.toDataURL());

    // Heart full
    canvas.width = SpriteSheet.heart.full.frame.width;
    canvas.height = SpriteSheet.heart.full.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.heart.full.frame.sourceX,
      SpriteSheet.heart.full.frame.sourceY,
      SpriteSheet.heart.full.frame.width,
      SpriteSheet.heart.full.frame.height,
      0,
      0,
      SpriteSheet.heart.full.frame.width,
      SpriteSheet.heart.full.frame.height,
    );

    const heartFull = await loadImage(canvas.toDataURL());

    // Heart empty
    canvas.width = SpriteSheet.heart.empty.frame.width;
    canvas.height = SpriteSheet.heart.empty.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.heart.empty.frame.sourceX,
      SpriteSheet.heart.empty.frame.sourceY,
      SpriteSheet.heart.empty.frame.width,
      SpriteSheet.heart.empty.frame.height,
      0,
      0,
      SpriteSheet.heart.empty.frame.width,
      SpriteSheet.heart.empty.frame.height,
    );

    const heartEmpty = await loadImage(canvas.toDataURL());

    // Cherry
    canvas.width = SpriteSheet.cherry.frame.width;
    canvas.height = SpriteSheet.cherry.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheet,
      SpriteSheet.cherry.frame.sourceX,
      SpriteSheet.cherry.frame.sourceY,
      SpriteSheet.cherry.frame.width,
      SpriteSheet.cherry.frame.height,
      0,
      0,
      SpriteSheet.cherry.frame.width,
      SpriteSheet.cherry.frame.height,
    );

    const cherry = await loadImage(canvas.toDataURL());

    // Debug images

    canvas.width = 1;
    canvas.height = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 1, 1);

    const pixel = await loadImage(canvas.toDataURL());

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 1, 1);
    ctx.globalAlpha = 0.4;
    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(pixel, 0, 0);

    const pixelRedAlpha = await loadImage(canvas.toDataURL());

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    return {
      spritesheet,
      sprite: {
        cherry,
        pixel,
        pixelRedAlpha,

        text: {
          zero,
          one,
          two,
          three,
          four,
          five,
          six,
          seven,
          eight,
          nine,
          score,
        },
        hud: {
          heartFull,
          heartEmpty,
        },
      },
    };
  }
}
