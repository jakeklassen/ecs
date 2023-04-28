import { loadImage } from '#/lib/asset-loader.js';
import { obtainCanvas2dContext } from '#/lib/dom.js';
import { rnd } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { transformFactory } from './components/transform.js';
import { Pico8Colors } from './constants.js';
import { explosionFactory } from './entity-factories/explosion.js';
import { Entity } from './entity.js';
import { SpriteSheet } from './spritesheet';
import { movementSystemFactory } from './systems/movement-system.js';
import { particleRenderingSystemFactory } from './systems/particle-rendering-system.js';
import { particleSystemFactory } from './systems/particle-system.js';
import { shockwaveRenderingSystemFactory } from './systems/shockwave-rendering-system.js';
import { shockwaveSystemFactory } from './systems/shockwave-system.js';

export type LoadedContent = Awaited<ReturnType<typeof Content.load>>;
type Explosion = HTMLCanvasElement | ImageBitmap | OffscreenCanvas;

export class Content {
  public static async load({
    explosionsSheetImageUrl,
    playerExplosionsSheetImageUrl,
    spriteSheetImageUrl,
  }: {
    explosionsSheetImageUrl: string;
    playerExplosionsSheetImageUrl: string;
    spriteSheetImageUrl: string;
  }) {
    const spritesheet = await loadImage(spriteSheetImageUrl);
    const explosions = await loadImage(explosionsSheetImageUrl);
    const playerExplosions = await loadImage(playerExplosionsSheetImageUrl);

    const canvas = document.createElement('canvas');
    const ctx = obtainCanvas2dContext(canvas);
    ctx.imageSmoothingEnabled = false;

    // Spritesheet
    canvas.width = spritesheet.width;
    canvas.height = spritesheet.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(spritesheet, 0, 0);

    // Numberic text

    // 0
    canvas.width = SpriteSheet.text.zero.frame.width;
    canvas.height = SpriteSheet.text.zero.frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      spritesheet,
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
      explosions,
      playerExplosions,
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

  public static generateExplosionSpriteSheet(numberOfSheets: number) {
    const canvas = document.createElement('canvas');
    const context = obtainCanvas2dContext(canvas);

    canvas.width = 128;
    canvas.height = 128;
    context.imageSmoothingEnabled = false;

    const world = new World<Entity>();

    const systems = [
      particleSystemFactory({
        world,
      }),
      shockwaveSystemFactory({
        world,
      }),
      movementSystemFactory({
        world,
      }),
      shockwaveRenderingSystemFactory({
        context,
        world,
      }),
      particleRenderingSystemFactory({
        context,
        world,
      }),
    ];

    const dt = 1 / 60;

    const explosionSheets: Array<Explosion> = [];

    for (let i = 0; i < numberOfSheets; i++) {
      const bufferCanvas = document.createElement('canvas');
      const bufferContext = obtainCanvas2dContext(bufferCanvas, {
        willReadFrequently: true,
      });

      bufferCanvas.width = 64;
      bufferCanvas.height = 64;
      bufferContext.imageSmoothingEnabled = false;

      let frames = 0;

      // Shockwave
      world.createEntity({
        shockwave: {
          radius: 3,
          targetRadius: 25,
          color: Pico8Colors.Color7,
          speed: 105,
        },
        transform: transformFactory({
          position: {
            x: canvas.width / 2,
            y: canvas.height / 2,
          },
        }),
      });

      // Initial flash of the explosion
      world.createEntity({
        particle: {
          age: 0,
          maxAge: 0,
          color: Pico8Colors.Color7,
          radius: 10,
          shape: 'circle',
        },
        transform: transformFactory({
          position: {
            x: canvas.width / 2,
            y: canvas.height / 2,
          },
        }),
        velocity: {
          x: 0,
          y: 0,
        },
      });

      explosionFactory(world, {
        count: 30,
        particleFn: () => ({
          age: rnd(2),
          maxAge: 10 + rnd(10),
          color: Pico8Colors.Color7,
          radius: 1 + rnd(4),
          shape: 'circle',
        }),
        position: {
          x: canvas.width / 2,
          y: canvas.height / 2,
        },
        velocityFn: () => ({
          x: Math.random() * 140,
          y: Math.random() * 140,
        }),
      });

      explosionFactory(world, {
        count: 20,
        particleFn: () => ({
          age: rnd(2),
          maxAge: 10 + rnd(10),
          color: Pico8Colors.Color7,
          isBlue: true,
          radius: 1 + rnd(4),
          shape: 'circle',
          spark: true,
        }),
        position: {
          x: canvas.width / 2,
          y: canvas.height / 2,
        },
        velocityFn: () => ({
          x: Math.random() * 300,
          y: Math.random() * 300,
        }),
      });

      while (world.entities.size > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        systems.forEach((system) => system(dt));

        frames++;

        const imageData = bufferContext.getImageData(
          0,
          0,
          bufferCanvas.width,
          bufferCanvas.height,
        );

        bufferCanvas.width = frames * 64;

        bufferContext.putImageData(imageData, 0, 0);
        bufferContext.drawImage(
          canvas,
          32,
          32,
          64,
          64,
          (frames - 1) * 64,
          0,
          64,
          64,
        );
      }

      console.log(`Explosion ${i} took ${frames} frames`);

      explosionSheets.push(bufferCanvas);
    }

    // Prep for popup
    const outputCanvas = document.createElement('canvas');
    const outputContext = obtainCanvas2dContext(outputCanvas);

    outputCanvas.width = explosionSheets.reduce(
      (width, sheet) => (sheet.width > width ? sheet.width : width),
      0,
    );
    outputCanvas.height = 64 * numberOfSheets;
    outputContext.imageSmoothingEnabled = false;

    outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    // outputContext.fillStyle = Pico8Colors.Color0;
    // outputContext.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

    for (const [i, sheet] of explosionSheets.entries()) {
      outputContext.drawImage(
        sheet,
        0,
        0,
        sheet.width,
        sheet.height,
        0,
        i * 64,
        sheet.width,
        sheet.height,
      );
    }

    const contentType = 'image/png';

    const byteCharacters = atob(
      outputCanvas.toDataURL().substr(`data:${contentType};base64,`.length),
    );
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');

    return explosionSheets;
  }

  public static generatePlayerExplosionSpriteSheet(numberOfSheets: number) {
    const canvas = document.createElement('canvas');
    const context = obtainCanvas2dContext(canvas);

    canvas.width = 128;
    canvas.height = 128;
    context.imageSmoothingEnabled = false;

    const world = new World<Entity>();

    const systems = [
      particleSystemFactory({
        world,
      }),
      shockwaveSystemFactory({
        world,
      }),
      movementSystemFactory({
        world,
      }),
      shockwaveRenderingSystemFactory({
        context,
        world,
      }),
      particleRenderingSystemFactory({
        context,
        world,
      }),
    ];

    const dt = 1 / 60;

    const explosionSheets: Array<Explosion> = [];

    for (let i = 0; i < numberOfSheets; i++) {
      const bufferCanvas = document.createElement('canvas');
      const bufferContext = obtainCanvas2dContext(bufferCanvas, {
        willReadFrequently: true,
      });

      bufferCanvas.width = 64;
      bufferCanvas.height = 64;
      bufferContext.imageSmoothingEnabled = false;

      let frames = 0;

      // Shockwave
      world.createEntity({
        shockwave: {
          radius: 3,
          targetRadius: 25,
          color: Pico8Colors.Color7,
          speed: 105,
        },
        transform: transformFactory({
          position: {
            x: canvas.width / 2,
            y: canvas.height / 2,
          },
        }),
      });

      // Initial flash of the explosion
      world.createEntity({
        particle: {
          age: 0,
          maxAge: 0,
          color: Pico8Colors.Color7,
          radius: 10,
          shape: 'circle',
        },
        transform: transformFactory({
          position: {
            x: canvas.width / 2,
            y: canvas.height / 2,
          },
        }),
        velocity: {
          x: 0,
          y: 0,
        },
      });

      explosionFactory(world, {
        count: 30,
        particleFn: () => ({
          age: rnd(2),
          maxAge: 10 + rnd(20),
          color: Pico8Colors.Color7,
          radius: 1 + rnd(4),
          shape: 'circle',
          isBlue: true,
        }),
        position: {
          x: canvas.width / 2,
          y: canvas.height / 2,
        },
        velocityFn: () => ({
          x: Math.random() * 140,
          y: Math.random() * 140,
        }),
      });

      explosionFactory(world, {
        count: 20,
        particleFn: () => ({
          age: rnd(2),
          maxAge: 10 + rnd(10),
          color: Pico8Colors.Color7,
          isBlue: true,
          radius: 1 + rnd(4),
          shape: 'circle',
          spark: true,
        }),
        position: {
          x: canvas.width / 2,
          y: canvas.height / 2,
        },
        velocityFn: () => ({
          x: Math.random() * 300,
          y: Math.random() * 300,
        }),
      });

      while (world.entities.size > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        systems.forEach((system) => system(dt));

        frames++;

        const imageData = bufferContext.getImageData(
          0,
          0,
          bufferCanvas.width,
          bufferCanvas.height,
        );

        bufferCanvas.width = frames * 64;

        bufferContext.putImageData(imageData, 0, 0);
        bufferContext.drawImage(
          canvas,
          32,
          32,
          64,
          64,
          (frames - 1) * 64,
          0,
          64,
          64,
        );
      }

      console.log(`Explosion ${i} took ${frames} frames`);

      explosionSheets.push(bufferCanvas);
    }

    // Prep for popup
    const outputCanvas = document.createElement('canvas');
    const outputContext = obtainCanvas2dContext(outputCanvas);

    outputCanvas.width = explosionSheets.reduce(
      (width, sheet) => (sheet.width > width ? sheet.width : width),
      0,
    );
    outputCanvas.height = 64 * numberOfSheets;
    outputContext.imageSmoothingEnabled = false;

    outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    // outputContext.fillStyle = Pico8Colors.Color0;
    // outputContext.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

    for (const [i, sheet] of explosionSheets.entries()) {
      outputContext.drawImage(
        sheet,
        0,
        0,
        sheet.width,
        sheet.height,
        0,
        i * 64,
        sheet.width,
        sheet.height,
      );
    }

    const contentType = 'image/png';

    const byteCharacters = atob(
      outputCanvas.toDataURL().substr(`data:${contentType};base64,`.length),
    );
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');

    return explosionSheets;
  }
}
