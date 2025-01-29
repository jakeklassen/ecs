import { Color } from '#/shared/components/color';
import { Position } from '#/shared/components/position';
import { Rectangle } from '#/shared/components/rectangle';
import { Velocity } from '#/shared/components/velocity';
import { World } from '@jakeklassen/ecs';
import '../../style.css';
import { CollisionSystem } from './collision-system';
import { Collision as Collision } from "./collision-component";
import { PhysicsSystem } from './physics-system';
import { RenderingSystem } from './rendering-system';

export const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const ctx = canvas.getContext('2d')!;

let dt = 0;
let last = performance.now();

/**
 * The game loop.
 */
function frame(hrt: DOMHighResTimeStamp) {
  // How much time has elapsed since the last frame?
  // Also convert to seconds.
  dt = (hrt - last) / 1000;

  // we need to work with our systems
  world.updateSystems(dt);

  last = hrt;

  // Keep the game loop going forever
  requestAnimationFrame(frame);
}

// create the world
const world = new World();

const getRandom = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min)) + min;
const padding = 10;

// attach components
for (let i = 0; i < 100; ++i) {
  world.addEntityComponents(
    world.createEntity(),
    new Position(
      getRandom(canvas.width - padding * 2, padding * 2),
      getRandom(canvas.height - padding * 2, padding * 2),
    ),
    new Velocity(getRandom(100, 20), getRandom(100, 20)),
    new Color(
      `rgba(${getRandom(255, 0)}, ${getRandom(255, 0)}, ${getRandom(
        255,
        0,
      )}, 1)`,
    ),
    // new Circle(getRandom(20, 10)),
    new Rectangle(getRandom(20, 10), getRandom(20, 10)),
    new Collision(),
  );
}

// add collision bound rect
// left
world.addEntityComponents(
  world.createEntity(),
  new Position(0, 0),
  new Velocity(0, 0),
  new Color(`rgba(${255}, ${0}, ${0}, 1)`),
  new Rectangle(padding, canvas.height),
  new Collision(),
);
// top
world.addEntityComponents(
  world.createEntity(),
  new Position(0, 0),
  new Velocity(0, 0),
  new Color(`rgba(${255}, ${0}, ${0}, 1)`),
  new Rectangle(canvas.width, padding),
  new Collision(),
);
// right
world.addEntityComponents(
  world.createEntity(),
  new Position(canvas.width - padding, 0),
  new Velocity(0, 0),
  new Color(`rgba(${255}, ${0}, ${0}, 1)`),
  new Rectangle(padding, canvas.height),
  new Collision(),
);
// bottom
world.addEntityComponents(
  world.createEntity(),
  new Position(0, canvas.height - padding),
  new Velocity(0, 0),
  new Color(`rgba(${255}, ${0}, ${0}, 1)`),
  new Rectangle(canvas.width, padding),
  new Collision(),
);

// add 10 static collision rect
for (let i = 0; i < 10; ++i) {
  world.addEntityComponents(
    world.createEntity(),
    new Position(
      getRandom(canvas.width - padding * 4, padding * 4),
      getRandom(canvas.height - padding * 4, padding * 4),
    ),
    new Color(`rgba(${255}, ${0}, ${0}, 1)`),
    new Rectangle(getRandom(100, 50), getRandom(100, 50)),
    new Collision(),
  );
}

world.addSystem(new CollisionSystem());
world.addSystem(new PhysicsSystem());
world.addSystem(new RenderingSystem(ctx));
// we need to start the game
requestAnimationFrame(frame);
