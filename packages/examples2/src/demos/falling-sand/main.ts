import { obtainCanvasAndContext2d } from '#/lib/dom';
import { World } from '@jakeklassen/ecs2';
import '../../style.css';
import { Entity } from './entity.js';
import { varyColor } from './lib/color.js';
import { removeRerenderSystemFactory } from './systems/remove-rerender-system.js';
import { renderingSystemFactory } from './systems/rendering-system.js';
import { swapSystemFactory } from './systems/swap-system.js';

const logOnceFactory = () => {
  const seen = new Set<string>();

  return (message: string) => {
    if (seen.has(message)) {
      return;
    }

    seen.add(message);
    console.log(message);
  };
};

const logOnce = logOnceFactory();

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

for (let index = 0; index < entityGrid.length; index++) {
  const x = index % canvas.width;
  const y = Math.floor(index / canvas.width);

  const gridIndex = x + y * canvas.width;

  const entity = world.createEntity({
    color: 'black',
    empty: true,
    node: {
      north: entityGrid[gridIndex - canvas.width] ?? null,
      south: entityGrid[gridIndex + canvas.width] ?? null,
      east: entityGrid[gridIndex + 1] ?? null,
      west: entityGrid[gridIndex - 1] ?? null,
    },
    position: {
      x,
      y,
    },
  });

  entityGrid[index] = entity;
}

for (let index = 0; index < entityGrid.length; index++) {
  const entity = entityGrid[index];

  const x = index % canvas.width;
  const y = Math.floor(index / canvas.width);
  const gridIndex = x + y * canvas.width;

  entity.node = {
    north: entityGrid[gridIndex - canvas.width] ?? null,
    south: entityGrid[gridIndex + canvas.width] ?? null,
    east: entityGrid[gridIndex + 1] ?? null,
    west: entityGrid[gridIndex - 1] ?? null,
  };
}

console.log(world.entities);

function mouseSystemFactory(world: World<Entity>, mouse: Mouse) {
  const safeToPick = world.archetype('empty');

  // TODO: Grab the center entity instead of the first entity,
  // and support going either left or right, and up or down.
  // This way we can potentially search faster.
  const firstEntity: Entity = safeToPick.entities.values().next().value;

  const getEntityFromXY = (x: number, y: number) => {
    if (x < 0 || y < 0) {
      return null;
    }

    if (x >= canvas.width || y >= canvas.height) {
      return null;
    }

    let entity = firstEntity;
    let xFound = false;

    while (!xFound) {
      if (entity.position.x === x) {
        xFound = true;
      } else if (entity.node.east != null) {
        entity = entity.node.east;
      }
    }

    let yFound = false;

    while (!yFound) {
      if (entity.position.y === y) {
        yFound = true;
      } else if (entity.node.south != null) {
        entity = entity.node.south;
      }
    }

    return entity;
  };

  const alreadyPlaced = new Map<string, boolean>();

  return () => {
    if (!mouse.down) {
      return;
    }

    alreadyPlaced.clear();

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
          const key = `${xx},${yy}`;

          const entity = getEntityFromXY(xx, yy);

          if (entity?.empty == null || alreadyPlaced.has(key)) {
            continue;
          }

          entity.color = varyColor(SAND_COLOR).toString();
          entity.position.x = xx;
          entity.position.y = yy;

          world.removeEntityComponents(entity, 'empty');
          world.addEntityComponents(entity, 'moving', true);
          alreadyPlaced.set(key, true);
        }
      }
    }
  };
}

function movementSystemFactory(world: World<Entity>) {
  const moveable = world.archetype('moving', 'position');
  const processed = new Set<Entity>();

  return () => {
    // logOnce(`moveable.entities: ${moveable.entities.size}`);
    processed.clear();

    for (const entity of moveable.entities) {
      if (processed.has(entity)) {
        continue;
      }

      if (entity.node.south?.empty === true) {
        world.addEntityComponents(entity, 'swap', {
          direction: 'south',
        });

        processed.add(entity);
        processed.add(entity.node.south);
      } else if (entity.node.south?.node.west?.empty === true) {
        world.addEntityComponents(entity, 'swap', {
          direction: 'southwest',
        });

        processed.add(entity);
        processed.add(entity.node.south.node.west);
      } else if (entity.node.south?.node.east?.empty === true) {
        world.addEntityComponents(entity, 'swap', {
          direction: 'southeast',
        });

        processed.add(entity);
        processed.add(entity.node.south.node.east);
      }
    }
  };
}

const spawnSystem = ((world: World<Entity>) => {
  let accumulator = 0;
  const SPAWN_TIME = 0.001;
  const firstEntity: Entity = world.entities.values().next().value;

  const getEntityFromXY = (x: number, y: number) => {
    let entity = firstEntity;
    let xFound = false;

    while (!xFound) {
      if (entity.position.x === x) {
        xFound = true;
      } else if (entity.node.east != null) {
        entity = entity.node.east;
      }
    }

    let yFound = false;

    while (!yFound) {
      if (entity.position.y === y) {
        yFound = true;
      } else if (entity.node.south != null) {
        entity = entity.node.south;
      }
    }

    return entity;
  };

  const generatedEntities = new Set<Entity>();

  return (dt: number) => {
    accumulator += dt;
    generatedEntities.clear();

    while (accumulator >= SPAWN_TIME) {
      accumulator -= SPAWN_TIME;

      const entity = getEntityFromXY(canvas.width / 2, 0);

      if (entity.empty !== true) {
        return;
      }

      entity.color = varyColor(SAND_COLOR).toString();
      world.removeEntityComponents(entity, 'empty');
      world.addEntityComponents(entity, 'moving', true);
      generatedEntities.add(entity);

      const leftEntity = getEntityFromXY(canvas.width / 4, 0);

      if (leftEntity.empty !== true) {
        return;
      }

      leftEntity.color = varyColor(SAND_COLOR).toString();
      world.removeEntityComponents(leftEntity, 'empty');
      world.addEntityComponents(leftEntity, 'moving', true);
      generatedEntities.add(leftEntity);

      const rightEntity = getEntityFromXY(canvas.width * 0.75, 0);

      if (rightEntity.empty !== true) {
        return;
      }

      rightEntity.color = varyColor(SAND_COLOR).toString();
      world.removeEntityComponents(rightEntity, 'empty');
      world.addEntityComponents(rightEntity, 'moving', true);
      generatedEntities.add(rightEntity);
    }
  };
})(world);

const movementSystem = movementSystemFactory(world);
const renderingSystem = renderingSystemFactory(world);
const removeRerenderSystem = removeRerenderSystemFactory(world);
const swapSystem = swapSystemFactory(world);
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

  removeRerenderSystem();
  movementSystem();
  swapSystem();
  spawnSystem(dt);
  mouseSystem();

  renderingSystem(context, dt);

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
