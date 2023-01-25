import { obtainCanvasAndContext2d } from '#/lib/dom';
import { World } from '@jakeklassen/ecs2';
import '../../style.css';
import { Entity } from './entity.js';
import { varyColor } from './lib/color.js';
import { removeRenderSystemFactory } from './systems/remove-render-system.js';
import { renderingSystemFactory } from './systems/rendering-system.js';
import { swapSystemFactory } from './systems/swap-system.js';

const SAND_COLOR = '#dcb159';

const { canvas, context } = obtainCanvasAndContext2d('#canvas');

context.imageSmoothingEnabled = false;

type Mouse = {
  down: boolean;
  position: {
    x: number;
    y: number;
  };
};

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

console.log(world.entities);

function mouseSystemFactory(world: World<Entity>, mouse: Mouse) {
  return () => {
    if (!mouse.down) {
      return;
    }

    const x = Math.floor(mouse.position.x);
    const y = Math.floor(mouse.position.y);

    const radius = 3;
    const probability = 0.5;
    const radiusSq = radius * radius;

    for (let y1 = -radius; y1 <= radius; y1++) {
      for (let x1 = -radius; x1 <= radius; x1++) {
        if (x1 * x1 + y1 * y1 <= radiusSq && Math.random() < probability) {
          const xx = x + x1;
          const yy = y + y1;

          if (xx < 0 || xx >= canvas.width || yy < 0 || yy >= canvas.height) {
            continue;
          }

          const gridIndex = xx + yy * canvas.width;
          const entity = entityGrid.at(gridIndex);

          if (entity?.empty !== true) {
            continue;
          }

          entity.color = varyColor(SAND_COLOR).toString();
          world.removeEntityComponents(entity, 'empty');
          world.addEntityComponents(entity, 'render', true);
          world.addEntityComponents(entity, 'moving', true);
        }
      }
    }
  };
}

function movementSystemFactory(world: World<Entity>) {
  const moveable = world.archetype('moving');

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
    // TODO: Solve left bias
    // ! HACK: We want the entities to be sorted by their gridIndex
    const entities = Array.from(moveable.entities).sort(
      (a, b) => b.gridIndex - a.gridIndex,
    );

    for (const entity of entities) {
      const below = entity.gridIndex + canvas.width;
      const belowLeft = below - 1;
      const belowRight = below + 1;

      const belowEntity = entityGrid[below];
      const belowLeftEntity = entityGrid[belowLeft];
      const belowRightEntity = entityGrid[belowRight];

      const isBelowLeftAvailable = belowLeftEntity?.empty === true;
      const isBelowRightAvailable = belowRightEntity?.empty === true;

      if (belowEntity?.empty === true && below < entityGrid.length) {
        swap(entity, belowEntity);

        world.addEntityComponents(entity, 'render', true);
        world.addEntityComponents(belowEntity, 'render', true);
      } else if (isBelowLeftAvailable) {
        swap(entity, belowLeftEntity);

        world.addEntityComponents(entity, 'render', true);
        world.addEntityComponents(belowLeftEntity, 'render', true);
      } else if (isBelowRightAvailable) {
        swap(entity, belowRightEntity);

        world.addEntityComponents(entity, 'render', true);
        world.addEntityComponents(belowRightEntity, 'render', true);
      } else {
        world.removeEntityComponents(entity, 'moving');
      }
    }
  };
}

const movementSystem = movementSystemFactory(world);
const renderingSystem = renderingSystemFactory(world);
const removeRenderSystem = removeRenderSystemFactory(world);
const swapSystem = swapSystemFactory(world, entityGrid);
const mouseSystem = mouseSystemFactory(world, mouse);

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
