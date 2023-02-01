import { obtainCanvasAndContext2d } from '#/lib/dom';
import { World } from '@jakeklassen/ecs2';
import '../../style.css';
import { Entity } from './entity.js';
import { mouseSystemFactory } from './systems/mouse-system.js';
import { movementSystemFactory } from './systems/movement-system.js';
import { removeRenderSystemFactory } from './systems/remove-render-system.js';
import { renderingSystemFactory } from './systems/rendering-system.js';

const { canvas, context } = obtainCanvasAndContext2d('#canvas');

context.imageSmoothingEnabled = false;

const mouse = {
  down: false,
  position: { x: 0, y: 0 },
};

canvas.addEventListener('mousedown', (e: MouseEvent) => {
  e.preventDefault();
  mouse.down = true;
});

canvas.addEventListener('mouseup', (e: MouseEvent) => {
  e.preventDefault();
  mouse.down = false;
});

canvas.addEventListener('touchstart', (e) => e.preventDefault());
canvas.addEventListener('touchend', (e) => e.preventDefault());
canvas.addEventListener('touchmove', (e) => e.preventDefault());

canvas.addEventListener('mouseleave', () => {
  mouse.down = false;
});

canvas.addEventListener('mousemove', (e: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  mouse.position.x = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouse.position.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});

const world = new World<Entity>();

const entityGrid: Entity[] = new Array(canvas.width * canvas.height).fill(null);

// ! This is a hack because the ECS has no concept of
// ! reversed iteration.
for (let index = entityGrid.length - 1; index >= 0; index--) {
  const x = index % canvas.width;
  const y = Math.floor(index / canvas.width);

  const gridIndex = x + y * canvas.width;

  const entity = world.createEntity({
    gridIndex,
    color: 'black',
    empty: true,
  });

  entityGrid[index] = entity;
}

const movementSystem = movementSystemFactory(world, entityGrid, canvas);
const renderingSystem = renderingSystemFactory(world);
const removeRenderSystem = removeRenderSystemFactory(world);
const mouseSystem = mouseSystemFactory(world, mouse, canvas, entityGrid);

const TARGET_FPS = 60;
const STEP = 1000 / TARGET_FPS;
const dt = STEP / 1000;
let last = performance.now();
let deltaTimeAccumulator = 0;

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
  const dt = Math.min(1000, hrt - last) / 1000;
  // deltaTimeAccumulator += Math.min(1000, hrt - last);

  // while (deltaTimeAccumulator >= STEP) {

  //   deltaTimeAccumulator -= STEP;
  // }

  removeRenderSystem();
  mouseSystem();
  movementSystem();
  renderingSystem(context, dt);

  // TODO: Move to UI canvas.
  // context.fillStyle = SAND_COLOR;
  // context.beginPath();
  // context.arc(
  //   Math.floor(mouse.position.x),
  //   Math.floor(mouse.position.y),
  //   3,
  //   0,
  //   2 * Math.PI,
  // );

  // context.fill();

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
