import { obtainCanvasAndContext2d } from '#/lib/dom';
import { World } from '@jakeklassen/ecs2';
import '../../style.css';
import { Entity } from './entity.js';
import { mouseSystemFactory } from './systems/mouse-system-factory.js';
import { removeRenderSystemFactory } from './systems/remove-render-system.js';
import { renderingSystemFactory } from './systems/rendering-system.js';
import { swapSystemFactory } from './systems/swap-system.js';

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

function movementSystemFactory(world: World<Entity>) {
  const width = canvas.width;
  const rowCount = Math.floor(entityGrid.length / width);
  const modified = new Set<number>();

  function swap(entityA: Entity, entityB: Entity) {
    // Move the entities on the grid BEFORE swapping their gridIndex
    [entityGrid[entityA.gridIndex], entityGrid[entityB.gridIndex]] = [
      entityB,
      entityA,
    ];

    [entityA.gridIndex, entityB.gridIndex] = [
      entityB.gridIndex,
      entityA.gridIndex,
    ];
  }

  return () => {
    modified.clear();

    for (let row = rowCount - 1; row >= 0; row--) {
      const rowOffset = row * width;
      const leftToRight = Math.random() > 0.5;

      for (let i = 0; i < width; i++) {
        let index = leftToRight ? rowOffset + i : rowOffset + width - i;

        const entity = entityGrid[index];

        if (entity?.empty === true) {
          continue;
        }

        const below = index + width;
        const belowLeft = below - 1;
        const belowRight = below + 1;

        const belowEntity = entityGrid[below];
        const belowLeftEntity = entityGrid[belowLeft];
        const belowRightEntity = entityGrid[belowRight];
        const column = index % width;
        let newIndex = index;

        if (belowEntity?.empty === true) {
          swap(entity, belowEntity);
          newIndex = below;

          world.addEntityComponents(entity, 'render', true);
          world.addEntityComponents(belowEntity, 'render', true);
        } else if (
          belowLeftEntity?.empty === true &&
          belowLeft % width < column
        ) {
          swap(entity, belowLeftEntity);
          newIndex = belowLeft;

          world.addEntityComponents(entity, 'render', true);
          world.addEntityComponents(belowLeftEntity, 'render', true);
        } else if (
          belowRightEntity?.empty === true &&
          belowRight % width > column
        ) {
          swap(entity, belowRightEntity);
          newIndex = belowRight;

          world.addEntityComponents(entity, 'render', true);
          world.addEntityComponents(belowRightEntity, 'render', true);
        }

        if (newIndex !== index) {
          modified.add(index);
          modified.add(newIndex);

          index = newIndex;
        }
      }
    }
  };
}

const movementSystem = movementSystemFactory(world);
const renderingSystem = renderingSystemFactory(world);
const removeRenderSystem = removeRenderSystemFactory(world);
const swapSystem = swapSystemFactory(world, entityGrid);
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
