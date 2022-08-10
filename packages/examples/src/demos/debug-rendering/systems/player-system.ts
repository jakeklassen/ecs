import { Transform } from '#/shared/components/transform';
import { System, World } from '@jakeklassen/ecs';
import { BoxCollider } from '../components/box-collider';
import { Direction } from '../components/direction';
import { PlayerTag } from '../components/player-tag';

export class PlayerSystem extends System {
  constructor(private readonly viewport: { width: number; height: number }) {
    super();
  }

  public update(world: World) {
    for (const [_entity, components] of world.view(
      PlayerTag,
      Transform,
      Direction,
      BoxCollider,
    )) {
      const transform = components.get(Transform);
      const direction = components.get(Direction);
      const boxCollider = components.get(BoxCollider);

      if (
        transform.position.x + boxCollider.offsetX >
        this.viewport.width - boxCollider.width
      ) {
        transform.position.x =
          this.viewport.width - boxCollider.width - boxCollider.offsetX;
        transform.scale.x = -1;
        direction.x = -1;
      } else if (transform.position.x + boxCollider.offsetX < 0) {
        transform.position.x = -boxCollider.offsetX;
        transform.scale.x = 1;
        direction.x = 1;
      }
    }
  }
}
