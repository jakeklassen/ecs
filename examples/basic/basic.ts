// tslint:disable: max-classes-per-file

import '@babel/polyfill';
import * as mainloop from 'mainloop.js';
import { System, World } from '../../src/ecs';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx == null) {
  throw new Error('failed to obtain canvas 2d context');
}

class Color {
  constructor(public color: string) {}
}

class Rectangle {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number,
  ) {}
}

const world = new World();
const player = world.createEntity();

world
  .addEntityComponent(player.id, new Rectangle(10, 10, 55, 55))
  .addEntityComponent(player.id, new Color('red'));

class RenderingSystem extends System {
  constructor(private readonly context: CanvasRenderingContext2D) {
    super();
  }

  public update(world: World, dt: number) {
    this.context.clearRect(0, 0, 640, 480);

    for (const [entity, components] of world.view(Rectangle, Color)) {
      const { color } = components.find(
        component => component.constructor === Color,
      ) as Color;

      const { x, y, width, height } = components.find(
        component => component.constructor === Rectangle,
      ) as Rectangle;

      this.context.fillStyle = color;
      this.context.fillRect(x, y, width, height);
    }
  }
}

world.addSystem(new RenderingSystem(ctx));

mainloop
  .setUpdate((dt: number) => {
    world.updateSystems(dt);
  })
  .start();
