import { Transform } from '#/shared/components/transform';
import { Velocity } from '#/shared/components/velocity';
import { System, World } from '@jakeklassen/ecs';
import { Direction } from '../components/direction';

export class MovementSystem extends System {
  update(world: World, dt: number): void {
    for (const [_entity, components] of world.view(
      Direction,
      Transform,
      Velocity,
    )) {
      const direction = components.get(Direction);
      const transform = components.get(Transform);
      const velocity = components.get(Velocity);

      transform.position.x += velocity.x * direction.x * dt;
      transform.position.y += velocity.y * direction.y * dt;
    }
  }
}
