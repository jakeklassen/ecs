import shipSpriteUrl from '#/assets/image/ship.png';
import { loadImage } from '#/lib/asset-loader';
import { Easing } from '#/lib/tween';
import { Transform } from '#/shared/components/transform';
import { Vector2d } from '#/shared/vector2d';
import { System, World } from '@jakeklassen/ecs';
import '../../style.css';
import { Sprite } from './components/sprite';
import { Tween, Tweens } from './components/tweens';
import { Frame } from './structures/frame';
import { TweensSystem } from './systems/tweens-system.js';

const ship = await loadImage(shipSpriteUrl);

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx == null) {
  throw new Error('failed to obtain canvas 2d context');
}

const world = new World();

world.addEntityComponents(
  world.createEntity(),
  new Transform(
    new Vector2d(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)),
  ),
  new Sprite(new Frame(0, 0, ship.width, ship.height)),
  new Tweens([
    new Tween({
      component: Sprite,
      property: 'opacity',
      duration: 1000,
      easing: Easing.Linear,
      from: 1,
      to: 0,
      yoyo: true,
    }),
    new Tween({
      component: Transform,
      property: 'position.y',
      duration: 1000,
      easing: Easing.Linear,
      from: Math.floor(canvas.height * 0.25),
      to: Math.floor(canvas.height * 0.75),
      yoyo: true,
    }),
    new Tween({
      component: Transform,
      property: 'rotation',
      duration: 1000,
      easing: Easing.Linear,
      from: (0 * Math.PI) / 180,
      to: (360 * Math.PI) / 180,
      yoyo: true,
    }),
  ]),
);

class RenderingSystem extends System {
  constructor(private readonly context: CanvasRenderingContext2D) {
    super();
  }

  public update(world: World) {
    this.context.clearRect(0, 0, canvas.width, canvas.height);

    for (const [_entity, components] of world.view(Sprite, Transform)) {
      const sprite = components.get(Sprite);
      const transform = components.get(Transform);

      this.context.globalAlpha = sprite.opacity;
      this.context.translate(transform.position.x, transform.position.y);
      this.context.rotate(transform.rotation);

      this.context.drawImage(
        ship,
        sprite.frame.sourceX,
        sprite.frame.sourceY,
        sprite.frame.width,
        sprite.frame.height,
        -sprite.frame.width / 2,
        -sprite.frame.height / 2,
        sprite.frame.width,
        sprite.frame.height,
      );

      this.context.globalAlpha = 1;
      this.context.resetTransform();
    }
  }
}

world.addSystem(new TweensSystem());
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
