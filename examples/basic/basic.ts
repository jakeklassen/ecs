// tslint:disable: max-classes-per-file

import '@babel/polyfill';
import * as mainloop from 'mainloop.js';
import { System, World } from '../../src';
import { Color, Rectangle, Transform, Velocity } from '../shared/components';
import { Vector2 } from '../shared/vector2';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx == null) {
  throw new Error('failed to obtain canvas 2d context');
}

const world = new World();
const player = world.createEntity();

world
  .addEntityComponent(player, new Transform(new Vector2(10, 10)))
  .addEntityComponent(player, new Velocity(100, 200))
  .addEntityComponent(player, new Rectangle(10, 10, 12, 12))
  .addEntityComponent(player, new Color('red'));

class PlayerMovementSystem extends System {
  constructor(private readonly viewport: Rectangle) {
    super();
  }

  public update(world: World, dt: number) {
    for (const [entity, components] of world.view(
      Rectangle,
      Transform,
      Velocity,
    )) {
      const rectangle = components.get(Rectangle) as Rectangle;
      const transform = components.get(Transform) as Transform;
      const velocity = components.get(Velocity) as Velocity;

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
}

class RenderingSystem extends System {
  constructor(private readonly context: CanvasRenderingContext2D) {
    super();
  }

  public update(world: World) {
    this.context.clearRect(0, 0, 640, 480);

    for (const [entity, components] of world.view(
      Rectangle,
      Color,
      Transform,
    )) {
      const { color } = components.get(Color) as Color;
      const { width, height } = components.get(Rectangle) as Rectangle;
      const transform = components.get(Transform) as Transform;

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
  new PlayerMovementSystem(new Rectangle(0, 0, canvas.width, canvas.height)),
);
world.addSystem(new RenderingSystem(ctx));

mainloop
  .setUpdate((dt: number) => {
    world.updateSystems(dt / 1000);
  })
  .start();
