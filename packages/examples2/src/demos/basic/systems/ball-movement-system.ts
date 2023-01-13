import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function ballMovementSystemFactory(
  world: World<Entity>,
  viewport: { width: number; height: number },
) {
  const balls = world.archetype(
    'ballTag',
    'rectangle',
    'transform',
    'velocity',
  );

  return (dt: number) => {
    for (const ball of balls.entities) {
      ball.transform.position.x += ball.velocity.x * dt;
      ball.transform.position.y += ball.velocity.y * dt;

      if (ball.transform.position.x + ball.rectangle.width > viewport.width) {
        ball.transform.position.x = viewport.width - ball.rectangle.width;
        ball.velocity.x *= -1;
      } else if (ball.transform.position.x < 0) {
        ball.transform.position.x = 0;
        ball.velocity.x *= -1;
      }

      if (ball.transform.position.y + ball.rectangle.height > viewport.height) {
        ball.transform.position.y = viewport.height - ball.rectangle.height;
        ball.velocity.y *= -1;
      } else if (ball.transform.position.y < 0) {
        ball.transform.position.y = 0;
        ball.velocity.y *= -1;
      }
    }
  };
}
