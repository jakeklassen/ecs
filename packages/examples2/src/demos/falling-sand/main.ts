import gabeRunImageUrl from '#/assets/image/gabe-idle-run.png';
import { loadImage } from '#/lib/asset-loader';
import { obtainCanvasAndContext2d } from '#/lib/dom';
import { World } from '@jakeklassen/ecs2';
import '../../style.css';
import { spriteAnimationFactory } from './components/sprite-animation.js';
import { Entity } from './entity.js';
import { SpriteSheet } from './spritesheet';
import { renderingSystemFactory } from './systems/rendering-system.js';
import { spriteAnimationSystemFactory } from './systems/sprite-animation-system.js';

const gabeImage = await loadImage(gabeRunImageUrl);

const { canvas, context } = obtainCanvasAndContext2d('#canvas');

context.imageSmoothingEnabled = false;

const world = new World<Entity>();

world.createEntity({
  transform: {
    position: {
      x: canvas.width / 2 - SpriteSheet.gabe.animations.run.frameWidth / 2,
      y: canvas.height / 2 - SpriteSheet.gabe.animations.run.frameHeight / 2,
    },
    rotation: 0,
    scale: {
      x: 1,
      y: 1,
    },
  },
  sprite: {
    frame: {
      sourceX: SpriteSheet.gabe.animations.run.sourceX,
      sourceY: SpriteSheet.gabe.animations.run.sourceY,
      width: SpriteSheet.gabe.animations.run.frameWidth,
      height: SpriteSheet.gabe.animations.run.frameHeight,
    },
    opacity: 1,
  },
  spriteAnimation: spriteAnimationFactory(
    {
      name: 'gabe-run',
      sourceX: SpriteSheet.gabe.animations.run.sourceX,
      sourceY: SpriteSheet.gabe.animations.run.sourceY,
      width: SpriteSheet.gabe.animations.run.width,
      height: SpriteSheet.gabe.animations.run.height,
      frameWidth: SpriteSheet.gabe.animations.run.frameWidth,
      frameHeight: SpriteSheet.gabe.animations.run.frameHeight,
    },
    1_000,
  ),
});

let last = performance.now();

const spriteAnimationSystem = spriteAnimationSystemFactory(world);
const renderingSystem = renderingSystemFactory(world);

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
  const dt = Math.min(1000, hrt - last) / 1000;

  spriteAnimationSystem(dt);
  renderingSystem(context, gabeImage, dt);

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
