import gabeRunImageUrl from '#/assets/image/gabe-idle-run.png';
import { loadImage } from '#/lib/asset-loader';
import { obtainCanvasAndContext2d } from '#/lib/dom';
import { Transform } from '#/shared/components/transform';
import { Vector2d } from '#/shared/vector2d';
import { World } from '@jakeklassen/ecs';
import '../../style.css';
import { Sprite } from './components/sprite';
import { SpriteAnimation } from './components/sprite-animation';
import { SpriteSheet } from './spritesheet';
import { AnimationDetails } from './structures/animation-details';
import { Frame } from './structures/frame';
import { RenderingSystem } from './systems/rendering-system';
import { SpriteAnimationSystem } from './systems/sprite-animation-system';

const gabeImage = await loadImage(gabeRunImageUrl);

const { canvas, context } = obtainCanvasAndContext2d('#canvas');

context.imageSmoothingEnabled = false;

const world = new World();

world.addEntityComponents(
  world.createEntity(),
  new Transform(
    new Vector2d(
      canvas.width / 2 - SpriteSheet.gabe.animations.run.frameWidth / 2,
      canvas.height / 2 - SpriteSheet.gabe.animations.run.frameHeight / 2,
    ),
  ),
  new Sprite(
    new Frame(
      SpriteSheet.gabe.animations.run.sourceX,
      SpriteSheet.gabe.animations.run.sourceY,
      SpriteSheet.gabe.animations.run.frameWidth,
      SpriteSheet.gabe.animations.run.frameHeight,
    ),
  ),
  new SpriteAnimation(
    new AnimationDetails(
      'gabe-run',
      SpriteSheet.gabe.animations.run.sourceX,
      SpriteSheet.gabe.animations.run.sourceY,
      SpriteSheet.gabe.animations.run.width,
      SpriteSheet.gabe.animations.run.height,
      SpriteSheet.gabe.animations.run.frameWidth,
      SpriteSheet.gabe.animations.run.frameHeight,
    ),
    1000,
  ),
);

world.addSystem(new SpriteAnimationSystem());
world.addSystem(new RenderingSystem(context, gabeImage));

let last = performance.now();

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
  const dt = Math.min(1000, hrt - last) / 1000;

  world.updateSystems(dt);

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
