import { loadImage } from '#/lib/asset-loader';
import { AudioManager, AudioMangerEvent } from '#/lib/audio-manager.js';
import { obtainCanvasAndContext2d } from '#/lib/dom';
import { World } from '@jakeklassen/ecs2';
import { Gamepad, Keyboard, or } from 'contro';
import '../../style.css';
import shootWavUrl from './assets/audio/shoot.wav';
import shmupImageUrl from './assets/image/shmup.png';
import { spriteAnimationFactory } from './components/sprite-animation.js';
import { Entity } from './entity.js';
import { SpriteSheet } from './spritesheet';
import { animationDetailsFactory } from './structures/animation-details.js';
import { boundToViewportSystemFactory } from './systems/bound-to-viewport-system.js';
import { debugRenderingSystemFactory } from './systems/debug-rendering-system.js';
import { destroyOnViewportExitSystemFactory } from './systems/destroy-on-viewport-exit-system.js';
import { movementSystemFactory } from './systems/movement-system.js';
import { playerSystemFactory } from './systems/player-system.js';
import { renderingSystemFactory } from './systems/rendering-system.js';
import { spriteAnimationSystemFactory } from './systems/sprite-animation-system.js';
import { trackPlayerSystemFactory } from './systems/track-player-system.js';
import { muzzleFlashSystemFactory } from './systems/muzzle-flash-system.js';
import { muzzleFlashRenderingSystemFactory } from './systems/muzzle-flash-rendering-system.js';

const audioManager = new AudioManager();

await audioManager.loadTrack('shoot', shootWavUrl);

await new Promise<void>((resolve) => {
  audioManager.on(AudioMangerEvent.Ready, () => {
    console.log('audio ready');

    resolve();
  });
});

const keyboard = new Keyboard();
const gamepad = new Gamepad();

const controls = {
  left: or(gamepad.button('Left'), keyboard.key('ArrowLeft')),
  right: or(gamepad.button('Right'), keyboard.key('ArrowRight')),
  up: or(gamepad.button('Up'), keyboard.key('ArrowUp')),
  down: or(gamepad.button('Down'), keyboard.key('ArrowDown')),
  fire: or(gamepad.button('A'), keyboard.key('Z')),
  debug: or(gamepad.button('RB').trigger, keyboard.key('D').trigger),
};

const shmupImage = await loadImage(shmupImageUrl);

const { canvas, context } = obtainCanvasAndContext2d('#canvas');

context.imageSmoothingEnabled = false;

const viewport = {
  width: canvas.width,
  height: canvas.height,
};

const world = new World<Entity>();

const player = world.createEntity({
  boundToViewport: true,
  boxCollider: SpriteSheet.player.boxCollider,
  direction: {
    x: 0,
    y: 0,
  },
  tagPlayer: true,
  transform: {
    position: {
      x: canvas.width / 2 - SpriteSheet.player.idle.frameWidth / 2,
      y: canvas.height * 0.9 - SpriteSheet.player.idle.frameHeight / 2,
    },
    rotation: 0,
    scale: {
      x: 1,
      y: 1,
    },
  },
  sprite: {
    frame: {
      sourceX: SpriteSheet.player.idle.sourceX,
      sourceY: SpriteSheet.player.idle.sourceY,
      width: SpriteSheet.player.idle.frameWidth,
      height: SpriteSheet.player.idle.frameHeight,
    },
    opacity: 1,
  },
  velocity: {
    x: 60,
    y: 60,
  },
});

world.createEntity({
  trackPlayer: {
    offset: {
      x: 0,
      y: SpriteSheet.player.idle.frameHeight,
    },
  },
  transform: {
    position: {
      x: player.transform.position.x,
      y: player.transform.position.y,
    },
    rotation: 0,
    scale: {
      x: 1,
      y: 1,
    },
  },
  sprite: {
    frame: {
      sourceX: SpriteSheet.player.thruster.sourceX,
      sourceY: SpriteSheet.player.thruster.sourceY,
      width: SpriteSheet.player.thruster.frameWidth,
      height: SpriteSheet.player.thruster.frameHeight,
    },
    opacity: 1,
  },
  spriteAnimation: spriteAnimationFactory(
    animationDetailsFactory(
      'player-thruster',
      SpriteSheet.player.thruster.animations.thrust.sourceX,
      SpriteSheet.player.thruster.animations.thrust.sourceY,
      SpriteSheet.player.thruster.animations.thrust.width,
      SpriteSheet.player.thruster.animations.thrust.height,
      SpriteSheet.player.thruster.animations.thrust.frameWidth,
      SpriteSheet.player.thruster.animations.thrust.frameHeight,
    ),
    100,
  ),
});

const TARGET_FPS = 60;
const STEP = 1000 / TARGET_FPS;
const dt = STEP / 1000;
let last = performance.now();
let deltaTimeAccumulator = 0;

const config = {
  debug: false,
};

const playerSystem = playerSystemFactory(
  world,
  controls,
  SpriteSheet,
  audioManager,
);
const spriteAnimationSystem = spriteAnimationSystemFactory(world);
const renderingSystem = renderingSystemFactory(world);
const muzzleFlashRenderingSystem = muzzleFlashRenderingSystemFactory(world);
const debugRenderingSystem = debugRenderingSystemFactory(
  world,
  context,
  config,
);

const muzzleFlashSystem = muzzleFlashSystemFactory(world);
const movementSystem = movementSystemFactory(world);
const boundToViewportSystem = boundToViewportSystemFactory(world, viewport);
const destroyOnViewportExitSystem = destroyOnViewportExitSystemFactory(
  world,
  viewport,
);
const trackPlayerSystem = trackPlayerSystemFactory(world);

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
  deltaTimeAccumulator += Math.min(1000, hrt - last);

  while (deltaTimeAccumulator >= STEP) {
    if (controls.debug.query()) {
      config.debug = !config.debug;
    }

    playerSystem(dt);
    movementSystem(dt);
    trackPlayerSystem(dt);
    boundToViewportSystem(dt);
    destroyOnViewportExitSystem(dt);
    muzzleFlashSystem(dt);
    spriteAnimationSystem(dt);

    deltaTimeAccumulator -= STEP;
  }

  renderingSystem(context, shmupImage, dt);
  muzzleFlashRenderingSystem(context);
  debugRenderingSystem(dt);

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
