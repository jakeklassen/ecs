import { obtainCanvasAndContext2d } from '#/lib/dom';
import { transformFactory } from '#/shared/components/transform.js';
import { World } from '@jakeklassen/ecs2';
import canvasRecord from 'canvas-record';
import '../../style.css';
import { Entity } from './entity.js';
import { varyColor } from './lib/color.js';
import { positionWithVariance } from './lib/position-with-variance.js';
import { renderingSystemFactory } from './systems/rendering-system.js';

const SAND_COLOR = '#dcb159';

const { canvas, context } = obtainCanvasAndContext2d('#canvas');

context.imageSmoothingEnabled = false;

const canvasRecorder = canvasRecord(canvas, {
  download: true,
  filename: 'recording.mp4',
  frameRate: 120,
});

const recorder = {
  recording: false,
  canvasRecorder,
};

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

canvas.addEventListener('mousemove', (e: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  mouse.position.x = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouse.position.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});

window.addEventListener('keypress', (e: KeyboardEvent) => {
  if (e.key === 'r') {
    if (recorder.recording) {
      recorder.canvasRecorder.stop();
      // recorder.canvasRecorder.dispose();
      recorder.recording = false;
    } else {
      recorder.canvasRecorder.start();
      recorder.recording = true;
    }
  }
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
    moved: false,
    node: {
      north: entityGrid[gridIndex - canvas.width] ?? null,
      south: entityGrid[gridIndex + canvas.width] ?? null,
      east: entityGrid[gridIndex + 1] ?? null,
      west: entityGrid[gridIndex - 1] ?? null,
    },
    transform: transformFactory({
      x,
      y,
    }),
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

// entityGrid[20].empty = false;
// entityGrid[20].color = SAND_COLOR;

let last = performance.now();

const renderingSystem = renderingSystemFactory(world);

function mouseSystemFactory(mouse: Mouse, entityGrid: Entity[]) {
  return () => {
    if (!mouse.down) {
      return;
    }

    const x = Math.floor(mouse.position.x);
    const y = Math.floor(mouse.position.y);

    const data = positionWithVariance(x, y, 3, 0.5);

    const index = data!.x + data!.y * canvas.width;

    const entity = entityGrid[index];
    if (entity == null) {
      return;
    }

    if (entity.empty === true) {
      entity.color = varyColor(SAND_COLOR).toString();
      entity.empty = false;
    }
  };
}

function movementSystemFactory(entityGrid: Entity[]) {
  const swap = (a: number, b: number) => {
    [entityGrid[a], entityGrid[b]] = [entityGrid[b], entityGrid[a]];
    [entityGrid[a].transform.position, entityGrid[b].transform.position] = [
      entityGrid[b].transform.position,
      entityGrid[a].transform.position,
    ];
  };

  const isEmpty = (index: number) => entityGrid[index]?.empty === true;

  return () => {
    for (let index = entityGrid.length - 1; index >= 0; index--) {
      const entity = entityGrid[index];

      if (entity.empty === true) {
        continue;
      }

      const below = index + canvas.width;
      const belowLeft = below - 1;
      const belowRight = below + 1;

      if (isEmpty(below)) {
        swap(index, below);
      } else if (isEmpty(belowLeft)) {
        swap(index, belowLeft);
      } else if (isEmpty(belowRight)) {
        swap(index, belowRight);
      }
    }
  };
}

const movementSystem = movementSystemFactory(entityGrid);
const mouseSystem = mouseSystemFactory(mouse, entityGrid);

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
  const dt = Math.min(1000, hrt - last) / 1000;

  context.fillStyle = 'black';
  context.clearRect(0, 0, canvas.width, canvas.height);

  mouseSystem();
  movementSystem();
  renderingSystem(context, dt);

  context.fillStyle = SAND_COLOR;
  context.beginPath();
  context.arc(
    Math.floor(mouse.position.x),
    Math.floor(mouse.position.y),
    3,
    0,
    2 * Math.PI,
  );

  context.fill();

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
