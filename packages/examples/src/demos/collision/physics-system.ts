import { Position } from '#/shared/components/position';
import { Rectangle } from '#/shared/components/rectangle';
import { Velocity } from '#/shared/components/velocity';
import { System, World } from '@jakeklassen/ecs';

// SYSTEMS
export class PhysicsSystem extends System {
  constructor() {
    super();
  }

  update(world: World, dt: number) {
    for (const [, componentMap] of world.view(Position, Velocity, Rectangle)) {
      // Move the position by some velocity
      const position = componentMap.get(Position);
      const velocity = componentMap.get(Velocity);

      position.x += velocity.x * dt;
      position.y += velocity.y * dt;
    }
  }
}
