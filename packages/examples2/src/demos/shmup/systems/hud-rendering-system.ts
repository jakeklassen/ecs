import { obtainCanvas2dContext } from '#/lib/dom.js';
import { Pico8Colors } from '../constants.js';
import { LoadedContent } from '../content.js';
import { GameState } from '../game-state.js';

function convertNumberToImageSourceFactory() {
  const textCanvas = document.createElement('canvas');
  const textContext = obtainCanvas2dContext(textCanvas);
  const tintCanvas = document.createElement('canvas');
  const tintContext = obtainCanvas2dContext(tintCanvas);

  return function convertNumberToImage(
    number: number,
    {
      context,
      characterPadding = 1,
      content,
      tintColor = 'transparent',
    }: {
      context: CanvasRenderingContext2D;
      characterPadding: number;
      content: LoadedContent;
      tintColor: string;
    },
  ): void {
    const numberString = number.toString();

    const characters: Array<{
      character: string;
      image: HTMLImageElement;
      width: number;
    }> = [];

    for (const character of numberString) {
      switch (character) {
        case '1':
          characters.push({
            character,
            image: content.sprite.text.one,
            width: content.sprite.text.one.width,
          });
          break;
        case '2':
          characters.push({
            character,
            image: content.sprite.text.two,
            width: content.sprite.text.two.width,
          });
          break;
        case '3':
          characters.push({
            character,
            image: content.sprite.text.three,
            width: content.sprite.text.three.width,
          });
          break;
        case '4':
          characters.push({
            character,
            image: content.sprite.text.four,
            width: content.sprite.text.four.width,
          });
          break;
        case '5':
          characters.push({
            character,
            image: content.sprite.text.five,
            width: content.sprite.text.five.width,
          });
          break;
        case '6':
          characters.push({
            character,
            image: content.sprite.text.six,
            width: content.sprite.text.six.width,
          });
          break;
        case '7':
          characters.push({
            character,
            image: content.sprite.text.seven,
            width: content.sprite.text.seven.width,
          });
          break;
        case '8':
          characters.push({
            character,
            image: content.sprite.text.eight,
            width: content.sprite.text.eight.width,
          });
          break;
        case '9':
          characters.push({
            character,
            image: content.sprite.text.nine,
            width: content.sprite.text.nine.width,
          });
          break;
        case '0':
          characters.push({
            character,
            image: content.sprite.text.zero,
            width: content.sprite.text.zero.width,
          });
          break;
      }
    }

    const canvasWidth = characters.reduce(
      (acc, { width }) => acc + width + characterPadding,
      -characterPadding,
    );

    const canvasHeight = content.sprite.text.zero.height;

    textContext.canvas.width = canvasWidth;
    textContext.canvas.height = canvasHeight;
    textContext.clearRect(
      0,
      0,
      textContext.canvas.width,
      textContext.canvas.height,
    );

    tintContext.canvas.width = canvasWidth;
    tintContext.canvas.height = canvasHeight;
    tintContext.clearRect(
      0,
      0,
      tintContext.canvas.width,
      tintContext.canvas.height,
    );

    textContext.save();
    textContext.fillStyle = tintColor;
    textContext.fillRect(
      0,
      0,
      textContext.canvas.width,
      textContext.canvas.height,
    );

    textContext.globalCompositeOperation = 'destination-atop';
    textContext.globalAlpha = 1;

    let x = 0;
    for (const character of characters) {
      tintContext.drawImage(character.image, x, 0);

      x += character.width + characterPadding;
    }

    textContext.drawImage(tintContext.canvas, 0, 0);
    textContext.restore();

    context.canvas.width = canvasWidth;
    context.canvas.height = canvasHeight;
    context.drawImage(textContext.canvas, 0, 0);
  };
}

export function hudRenderingSystemFactory({
  gameState,
  content,
  context,
}: {
  gameState: GameState;
  content: LoadedContent;
  context: CanvasRenderingContext2D;
}) {
  const scoreCanvas = document.createElement('canvas');
  const scoreContext = obtainCanvas2dContext(scoreCanvas);
  const cherriesCanvas = document.createElement('canvas');
  const cherriesContext = obtainCanvas2dContext(cherriesCanvas);
  const previousState = structuredClone(gameState);

  scoreCanvas.style.imageRendering = 'pixelated';
  scoreContext.imageSmoothingEnabled = false;
  cherriesCanvas.style.imageRendering = 'pixelated';
  cherriesContext.imageSmoothingEnabled = false;

  const convertNumberToImageSource = convertNumberToImageSourceFactory();

  convertNumberToImageSource(gameState.score, {
    characterPadding: 1,
    context: scoreContext,
    content,
    tintColor: Pico8Colors.Color12,
  });

  convertNumberToImageSource(gameState.cherries, {
    characterPadding: 1,
    context: cherriesContext,
    content,
    tintColor: Pico8Colors.Color14,
  });

  return (_dt: number) => {
    for (let i = 0; i < gameState.maxLives; i++) {
      if (i < gameState.lives) {
        context.drawImage(content.sprite.hud.heartFull, (i + 1) * 9 - 8, 1);
      } else {
        context.drawImage(content.sprite.hud.heartEmpty, (i + 1) * 9 - 8, 1);
      }
    }

    if (gameState.score !== previousState.score) {
      convertNumberToImageSource(gameState.score, {
        characterPadding: 1,
        content,
        context: scoreContext,
        tintColor: Pico8Colors.Color12,
      });

      previousState.score = gameState.score;
    }

    context.drawImage(
      scoreCanvas,
      Math.floor(context.canvas.width / 2 - content.sprite.text.score.width) +
        content.sprite.text.score.width,
      2,
    );

    if (gameState.cherries !== previousState.cherries) {
      convertNumberToImageSource(gameState.cherries, {
        characterPadding: 1,
        content,
        context: cherriesContext,
        tintColor: Pico8Colors.Color12,
      });
    }

    context.drawImage(
      content.sprite.text.score,
      Math.floor(context.canvas.width / 2 - content.sprite.text.score.width),
      2,
    );
    context.drawImage(content.sprite.cherry, 108, 1);
    context.drawImage(cherriesCanvas, 118, 2);
  };
}
