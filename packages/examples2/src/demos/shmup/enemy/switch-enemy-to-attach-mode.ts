import { Easing } from '#/lib/tween.js';
import { World } from '@jakeklassen/ecs2';
import { SetRequired } from 'type-fest';
import { tweenFactory } from '../components/tween.js';
import { EnemyType } from '../constants.js';
import { Entity } from '../entity.js';
import { TimeSpan, Timer } from '../timer.js';

export function switchEnemyToAttackMode({
  enemy,
  timer,
  world,
}: {
  enemy: SetRequired<
    Entity,
    'enemyState' | 'enemyType' | 'spriteAnimation' | 'transform'
  >;
  timer: Timer;
  world: World<Entity>;
}) {
  const startDirection = Math.random() < 0.5 ? 1 : -1;
  enemy.enemyState = 'attack';
  // Double the animation speed. `frameRate` is a fraction of a second,
  // so we're not multiplying by 2, but dividing by 2 to make it smaller.
  // e.g. less time to wait between frames.
  enemy.spriteAnimation.frameRate /= 2;

  const direction = {
    x: 0,
    y: 1,
  };

  let boostTweenXDuration = 700;
  let tweenXDuration = 800;
  let tweenXDistance = 16;

  const velocity = {
    x: 0,
    y: 51,
  };

  const tweens: NonNullable<Entity['tweens']> = [];

  if (enemy.transform.position.x < 16) {
    // Always start to the right
    tweens.push(
      tweenFactory('transform.position.x', {
        duration: boostTweenXDuration,
        easing: Easing.InSine,
        from: enemy.transform.position.x,
        to: enemy.transform.position.x + 24,
      }),
      tweenFactory('transform.position.x', {
        delay: boostTweenXDuration,
        duration: tweenXDuration,
        easing: Easing.InSine,
        from: enemy.transform.position.x + 24,
        to: enemy.transform.position.x + 24 - tweenXDistance,
        fullSwing: true,
        yoyo: true,
        maxIterations: Infinity,
      }),
    );
  } else if (enemy.transform.position.x > 104) {
    // Always start to the left
    tweens.push(
      tweenFactory('transform.position.x', {
        duration: boostTweenXDuration,
        easing: Easing.InSine,
        from: enemy.transform.position.x,
        to: enemy.transform.position.x - 24,
      }),
      tweenFactory('transform.position.x', {
        delay: boostTweenXDuration,
        duration: tweenXDuration,
        easing: Easing.InSine,
        from: enemy.transform.position.x - 24,
        to: enemy.transform.position.x - 24 + tweenXDistance,
        fullSwing: true,
        yoyo: true,
        maxIterations: Infinity,
      }),
    );
  } else {
    tweens.push(
      tweenFactory('transform.position.x', {
        duration: tweenXDuration,
        easing: Easing.InSine,
        from: enemy.transform.position.x,
        to: enemy.transform.position.x + startDirection * tweenXDistance,
        fullSwing: true,
        yoyo: true,
        maxIterations: Infinity,
      }),
    );
  }

  // Trigger a `shake` tween on the enemy
  if (
    enemy.enemyType === EnemyType.GreenAlien ||
    enemy.enemyType === EnemyType.RedFlameGuy ||
    enemy.enemyType === EnemyType.YellowShip
  ) {
    world.addEntityComponents(enemy, 'tweens', [
      ...(enemy.tweens ?? []).concat(
        tweenFactory('transform.position.x', {
          duration: 80,
          destroyAfter: 2000,
          easing: Easing.InSine,
          from: enemy.transform.position.x,
          to: enemy.transform.position.x + 1,
          yoyo: true,
          fullSwing: true,
          maxIterations: Infinity,
        }),
      ),
    ]);
  }

  timer.add(new TimeSpan(2000), () => {
    if (world.entities.has(enemy) === false) {
      return;
    }

    // The red guy is more aggressive
    if (enemy.enemyType === EnemyType.RedFlameGuy) {
      velocity.y = 75;
      tweenXDuration = 400;
      tweenXDistance = 8;
    } else if (enemy.enemyType === EnemyType.SpinningShip) {
      velocity.y = 60;

      // The spinning ship moves down until the player is within
      // perpendicular sight. It will move laterally towards the player
      // at this point.
      world.addEntityComponents(enemy, 'tagLateralHunter', true);
    } else if (enemy.enemyType === EnemyType.YellowShip) {
      velocity.y = 10;

      world.addEntityComponents(enemy, 'tagYellowShip', true);
    }

    // Only these two tween
    if (
      enemy.enemyType === EnemyType.GreenAlien ||
      enemy.enemyType === EnemyType.RedFlameGuy
    ) {
      world.addEntityComponents(enemy, 'tweens', [
        ...(enemy.tweens ?? []).concat(tweens),
      ]);
    }

    world.addEntityComponents(enemy, 'direction', direction);
    world.addEntityComponents(enemy, 'velocity', velocity);
  });
}
