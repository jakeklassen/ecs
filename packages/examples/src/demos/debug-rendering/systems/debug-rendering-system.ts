import { Transform } from '#/shared/components/transform';
import { System, World } from '@jakeklassen/ecs';
import { BoxCollider } from '../components/box-collider';

export class DebugRenderingSystem extends System {
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly config: Readonly<{ debug: boolean }>,
  ) {
    super();
  }

  update(world: World, _dt: number): void {
    if (this.config.debug === false) {
      return;
    }

    for (const [_entity, components] of world.view(Transform, BoxCollider)) {
      const transform = components.get(Transform);
      const boxCollider = components.get(BoxCollider);

      this.context.translate(transform.position.x, transform.position.y);
      this.context.rotate(transform.rotation);
      this.context.scale(transform.scale.x, transform.scale.y);

      this.context.globalAlpha = 0.3;

      this.context.fillStyle = 'red';
      this.context.fillRect(
        transform.scale.x > 0
          ? boxCollider.offsetX
          : -boxCollider.offsetX - boxCollider.width,
        transform.scale.y > 0
          ? boxCollider.offsetY
          : -boxCollider.offsetY - boxCollider.height,
        boxCollider.width,
        boxCollider.height,
      );

      this.context.globalAlpha = 1;
      this.context.resetTransform();
    }
  }
}
