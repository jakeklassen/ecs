import { Transform } from '#/shared/components/transform';
import { System, World } from '@jakeklassen/ecs';
import { Sprite } from '../components/sprite';

export class RenderingSystem extends System {
  canvas: HTMLCanvasElement;

  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly spriteSheet: HTMLImageElement,
  ) {
    super();

    this.canvas = context.canvas;
  }

  public update(world: World) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const [_entity, components] of world.view(Sprite, Transform)) {
      const sprite = components.get(Sprite);
      const transform = components.get(Transform);

      this.context.globalAlpha = sprite.opacity;

      this.context.translate(transform.position.x, transform.position.y);
      this.context.rotate(transform.rotation);
      this.context.scale(transform.scale.x, transform.scale.y);

      this.context.drawImage(
        this.spriteSheet,
        sprite.frame.sourceX,
        sprite.frame.sourceY,
        sprite.frame.width,
        sprite.frame.height,
        transform.scale.x > 0 ? 0 : -sprite.frame.width,
        transform.scale.y > 0 ? 0 : -sprite.frame.height,
        sprite.frame.width,
        sprite.frame.height,
      );

      this.context.globalAlpha = 1;
      this.context.resetTransform();
    }
  }
}
