import { Position } from '#/shared/components/position';
import { Rectangle } from '#/shared/components/rectangle';
import { Velocity } from '#/shared/components/velocity';
import { System, World } from '@jakeklassen/ecs';
import { Collision } from './collision-component';

export class CollisionSystem extends System {
  update(world: World): void {
    for (const [entity1, components1] of world.view(
      Position,
      Velocity,
      Rectangle,
    )) {
      for (const [entity2, components2] of world.view(
        Collision,
        Rectangle,
        Position,
      )) {
        if (entity1 === entity2) {
          // not collision with self
          continue;
        }
        const position1 = components1.get(Position);
        const velocity1 = components1.get(Velocity);
        const rectangle1 = components1.get(Rectangle);

        const position2 = components2.get(Position);
        const rectangle2 = components2.get(Rectangle);

        // judge is collision
        const isCollision =
          position1.x + rectangle1.width > position2.x &&
          position1.x < position2.x + rectangle2.width &&
          position1.y + rectangle1.height > position2.y &&
          position1.y < position2.y + rectangle2.height;
        if (isCollision) {
          const centerPosition1 = [
            position1.x + rectangle1.width / 2,
            position1.y + rectangle1.height / 2,
          ];
          const centerPosition2 = [
            position2.x + rectangle2.width / 2,
            position2.y + rectangle2.height / 2,
          ];

          // judge collision direction
          const directions = [
            [0, rectangle2.width],
            [rectangle2.height, 0],
            [0, -rectangle2.width],
            [-rectangle2.height, 0],
          ];
          const center2col = [
            centerPosition1[0] - centerPosition2[0],
            centerPosition1[1] - centerPosition2[1],
          ];
          const directionDotValue = directions.map((direction) => {
            const [x, y] = direction;
            return x * center2col[0] + y * center2col[1];
          });
          const directionIndex = directionDotValue.indexOf(
            Math.max(...directionDotValue),
          );
          const direction = directions[directionIndex];
          // adaptor, two rect should leave away
          if (velocity1.x * direction[0] + velocity1.y * direction[1] < 0) {
            velocity1.x = direction[0] === 0 ? velocity1.x : -velocity1.x;
            velocity1.y = direction[1] === 0 ? velocity1.y : -velocity1.y;
          }
        }
      }
    }
  }
}
