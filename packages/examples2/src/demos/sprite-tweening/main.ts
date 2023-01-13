import shipSpriteUrl from '#/assets/image/ship.png';
import { loadImage } from '#/lib/asset-loader';
import { Easing } from '#/lib/tween';
import { transformFactory } from '#/shared/components/transform.js';
import { World } from '@jakeklassen/ecs2';
import '../../style.css';
import { spriteFactory } from './components/sprite.js';
import { tweenFactory } from './components/tween.js';
import { Entity } from './entity.js';
import { frameFactory } from './structures/frame.js';
import { renderingSystemFactory } from './systems/rendering-system.js';
import { tweenSystemFactory } from './systems/tweens-system.js';

const ship = await loadImage(shipSpriteUrl);

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx == null) {
  throw new Error('failed to obtain canvas 2d context');
}

ctx.imageSmoothingEnabled = false;

const world = new World<Entity>();

world.createEntity({
  transform: transformFactory({
    x: Math.floor(canvas.width / 2),
    y: Math.floor(canvas.height / 2),
  }),
  sprite: spriteFactory(frameFactory(0, 0, ship.width, ship.height)),
  tweens: [
    tweenFactory('sprite.opacity', {
      duration: 1000,
      easing: Easing.Linear,
      from: 1,
      to: 0,
      yoyo: true,
    }),
    tweenFactory('transform.scale.x', {
      duration: 1000,
      easing: Easing.Linear,
      from: 1,
      to: 2,
      yoyo: true,
    }),
    tweenFactory('transform.scale.y', {
      duration: 1000,
      easing: Easing.Linear,
      from: 1,
      to: 2,
      yoyo: true,
    }),
    tweenFactory('transform.position.y', {
      duration: 1000,
      easing: Easing.Linear,
      from: Math.floor(canvas.height * 0.25),
      to: Math.floor(canvas.height * 0.75),
      yoyo: true,
    }),
    tweenFactory('transform.rotation', {
      duration: 1000,
      easing: Easing.Linear,
      from: (0 * Math.PI) / 180,
      to: (360 * Math.PI) / 180,
      yoyo: true,
    }),
  ],
});

const tweensSystem = tweenSystemFactory(world);
const renderingSystem = renderingSystemFactory(world, ctx, ship);

let last = performance.now();

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
  const dt = Math.min(1000, hrt - last) / 1000;

  tweensSystem(dt);
  renderingSystem(dt);

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
