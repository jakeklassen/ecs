import { System, World } from '@jakeklassen/ecs';
import { Color, Rectangle, Transform, Velocity } from '#/shared/components';
import { Vector2d } from '#/shared/vector2d';
import '../../style.css';
import { BallTag } from './components/ball-tag';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx == null) {
  throw new Error('failed to obtain canvas 2d context');
}

const world = new World();
const ball = world.createEntity();

world.addEntityComponents(
  ball,
  new BallTag(),
  new Transform(new Vector2d(10, 10)),
  new Velocity(100, 200),
  new Rectangle(10, 10, 12, 12),
  new Color('red'),
);

class BallMovementSystem extends System {
  constructor(private readonly viewport: Rectangle) {
    super();
  }

  public update(world: World, dt: number) {
    const ball = world.findEntity(BallTag);

    if (ball == null) {
      throw new Error('Entity with BallTag not found');
    }

    const components = world.getEntityComponents(ball)!;

    const rectangle = components.get<Rectangle>(Rectangle)!;
    const transform = components.get<Transform>(Transform)!;
    const velocity = components.get<Velocity>(Velocity)!;

    transform.position.x += velocity.x * dt;
    transform.position.y += velocity.y * dt;

    if (transform.position.x + rectangle.width > this.viewport.width) {
      transform.position.x = this.viewport.width - rectangle.width;
      velocity.flipX();
    } else if (transform.position.x < 0) {
      transform.position.x = 0;
      velocity.flipX();
    }

    if (transform.position.y + rectangle.height > this.viewport.height) {
      transform.position.y = this.viewport.height - rectangle.height;
      velocity.flipY();
    } else if (transform.position.y < 0) {
      transform.position.y = 0;
      velocity.flipY();
    }
  }
}

class RenderingSystem extends System {
  constructor(private readonly context: CanvasRenderingContext2D) {
    super();
  }

  public update(world: World) {
    this.context.clearRect(0, 0, 640, 480);

    for (const [_entity, components] of world.view(
      Rectangle,
      Color,
      Transform,
    )) {
      const { color } = components.get(Color);
      const { width, height } = components.get(Rectangle);
      const transform = components.get(Transform);

      this.context.fillStyle = color;
      this.context.fillRect(
        transform.position.x,
        transform.position.y,
        width,
        height,
      );
    }
  }
}

world.addSystem(
  new BallMovementSystem(new Rectangle(0, 0, canvas.width, canvas.height)),
);
world.addSystem(new RenderingSystem(ctx));

let last = performance.now();

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
  const dt = Math.min(1000, hrt - last) / 1000;

  world.updateSystems(dt);

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
