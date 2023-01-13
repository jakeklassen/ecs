import { colorFactory } from '#/shared/components/color.js';
import { transformFactory } from '#/shared/components/transform.js';
import { World } from '@jakeklassen/ecs2';
import '../../style.css';
import { ballTagFactory } from './components/ball-tag.js';
import { Entity } from './entity.js';
import { ballMovementSystemFactory } from './systems/ball-movement-system.js';
import { redneringSystemFactory } from './systems/rendering-system.js';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx == null) {
  throw new Error('failed to obtain canvas 2d context');
}

const world = new World<Entity>();

world.createEntity({
  ballTag: ballTagFactory(),
  color: colorFactory('red'),
  rectangle: { width: 12, height: 12 },
  transform: transformFactory({ x: 10, y: 10 }),
  velocity: { x: 100, y: 200 },
});

const ballMovementSystem = ballMovementSystemFactory(world, {
  width: canvas.width,
  height: canvas.height,
});

const renderingSystem = redneringSystemFactory(world, ctx);

let last = performance.now();

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
  const dt = Math.min(1000, hrt - last) / 1000;

  ballMovementSystem(dt);
  renderingSystem();

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
