import gabeRunImageUrl from '#/assets/image/gabe-idle-run.png';
import { loadImage } from '#/lib/asset-loader';
import { obtainCanvasAndContext2d } from '#/lib/dom';
import { Transform } from '#/shared/components/transform';
import { Velocity } from '#/shared/components/velocity';
import { Vector2d } from '#/shared/vector2d';
import { World } from '@jakeklassen/ecs';
import { Pane } from 'tweakpane';
import '../../style.css';
import { BoxCollider } from './components/box-collider';
import { Direction } from './components/direction';
import { PlayerTag } from './components/player-tag';
import { Sprite } from './components/sprite';
import { SpriteAnimation } from './components/sprite-animation';
import { SpriteSheet } from './spritesheet';
import { AnimationDetails } from './structures/animation-details';
import { Frame } from './structures/frame';
import { DebugRenderingSystem } from './systems/debug-rendering-system';
import { MovementSystem } from './systems/movement-system';
import { PlayerSystem } from './systems/player-system';
import { RenderingSystem } from './systems/rendering-system';
import { SpriteAnimationSystem } from './systems/sprite-animation-system';

const gabeImage = await loadImage(gabeRunImageUrl);

const { canvas, context } = obtainCanvasAndContext2d('#canvas');

context.imageSmoothingEnabled = false;

const config = {
  debug: false,
};

const PARAMS = {
  debug: false,
};

const pane = new Pane();
const debugInput = pane.addBinding(PARAMS, 'debug');

debugInput.on('change', (event) => {
  config.debug = event.value;
});

const world = new World();

world.addEntityComponents(
  world.createEntity(),
  new PlayerTag(),
  new Transform(new Vector2d(32, 54), 0, new Vector2d(1, 1)),
  new Velocity(50, 0),
  new Direction(1, 0),
  new BoxCollider(4, 2, 16, 22),
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
world.addSystem(new MovementSystem());
world.addSystem(
  new PlayerSystem({ width: canvas.width, height: canvas.height }),
);
world.addSystem(new RenderingSystem(context, gabeImage));
world.addSystem(new DebugRenderingSystem(context, config));

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
