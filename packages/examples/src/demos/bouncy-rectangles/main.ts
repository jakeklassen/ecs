import { Color } from '#/shared/components/color';
import { Position } from '#/shared/components/position';
import { Rectangle } from '#/shared/components/rectangle';
import { Velocity } from '#/shared/components/velocity';
import { System, World } from '@jakeklassen/ecs';
import '../../style.css';

const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
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
  Math.floor(Math.random() * max) + min;

// attach components
for (let i = 0; i < 100; ++i) {
  world.addEntityComponents(
    world.createEntity(),
    new Position(getRandom(canvas.width), getRandom(canvas.height)),
    new Velocity(getRandom(100, 20), getRandom(100, 20)),
    new Color(
      `rgba(${getRandom(255, 0)}, ${getRandom(255, 0)}, ${getRandom(
        255,
        0,
      )}, 1)`,
    ),
    new Rectangle(getRandom(20, 10), getRandom(20, 10)),
  );
}

// SYSTEMS

class PhysicsSystem extends System {
  constructor(public readonly viewport: Rectangle) {
    super();
  }

  update(world: World, dt: number) {
    for (const [, componentMap] of world.view(Position, Velocity, Rectangle)) {
      // Move the position by some velocity
      const position = componentMap.get(Position);
      const velocity = componentMap.get(Velocity);
      const rectangle = componentMap.get(Rectangle);

      position.x += velocity.x * dt;
      position.y += velocity.y * dt;

      if (position.x + rectangle.width > this.viewport.width) {
        // Snap collider back into viewport
        position.x = this.viewport.width - rectangle.width;
        velocity.x = -velocity.x;
      } else if (position.x < 0) {
        position.x = 0;
        velocity.x = -velocity.x;
      }

      if (position.y + rectangle.height > this.viewport.height) {
        position.y = this.viewport.height - rectangle.height;
        velocity.y = -velocity.y;
      } else if (position.y < 0) {
        position.y = 0;
        velocity.y = -velocity.y;
      }
    }
  }
}

// Rendering system
class RenderingSystem extends System {
  constructor(private readonly context: CanvasRenderingContext2D) {
    super();
  }

  public update(world: World, _dt: number): void {
    this.context.clearRect(0, 0, canvas.width, canvas.height);

    for (const [, componentMap] of world.view(Position, Color, Rectangle)) {
      const { color } = componentMap.get(Color);
      const { width, height } = componentMap.get(Rectangle);
      const { x, y } = componentMap.get(Position);

      this.context.fillStyle = color;
      this.context.fillRect(x, y, width, height);
    }
  }
}

world.addSystem(new PhysicsSystem(new Rectangle(canvas.width, canvas.height)));
world.addSystem(new RenderingSystem(ctx));

// we need to start the game
requestAnimationFrame(frame);
