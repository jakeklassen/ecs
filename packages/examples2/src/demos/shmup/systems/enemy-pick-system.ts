import { rndInt } from '#/lib/math.js';
import { Easing } from '#/lib/tween.js';
import { World } from '@jakeklassen/ecs2';
import { tweenFactory } from '../components/tween.js';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';
import { TimeSpan, Timer } from '../timer.js';

export function enemyPickSystemFactory({
  config,
  gameState,
  timer,
  world,
}: {
  config: Config;
  gameState: GameState;
  timer: Timer;
  world: World<Entity>;
}) {
  const enemies = world.archetype(
    'enemyState',
    'enemyType',
    'spriteAnimation',
    'tagEnemy',
    'transform',
  );

  let attackFrequencyTimer = 0;
  // @ts-ignore
  let fireFrequencyTimer = 0;

  return (dt: number) => {
    if (gameState.waveReady === false) {
      return;
    }

    const wave = config.waves[gameState.wave];

    if (wave == null) {
      return;
    }

    // TODO: smelly
    if (enemies.entities.size === 0) {
      world.createEntity({
        eventNextWave: true,
      });
    }

    // Sort by position using x and y, from left to right, top to bottom
    // All _rows_ should be grouped together
    const enemiesArray = Array.from(enemies.entities)
      .filter((enemy) => enemy.enemyState === 'protect')
      .sort((a, b) => {
        if (a.transform.position.y < b.transform.position.y) {
          return -1;
        }

        if (a.transform.position.y > b.transform.position.y) {
          return 1;
        }

        if (a.transform.position.x < b.transform.position.x) {
          return -1;
        }

        if (a.transform.position.x > b.transform.position.x) {
          return 1;
        }

        return 0;
      });

    attackFrequencyTimer += dt;
    fireFrequencyTimer += dt;

    if (attackFrequencyTimer >= wave.attackFrequency) {
      attackFrequencyTimer = 0;

      const max = Math.min(enemies.entities.size, 10);
      const randomIndex = rndInt(max, 1);
      const enemyIndex = enemies.entities.size - randomIndex;
      const enemy = enemiesArray[enemyIndex];

      if (enemy == null || enemy.enemyState === 'attack') {
        return;
      }

      // We don't move the boss or yellow ship
      if (enemy.enemyType === 'boss') {
        return;
      }

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

      if (
        enemy.enemyType === 'greenAlien' ||
        enemy.enemyType === 'redFlameGuy'
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
        if (enemy.enemyType === 'redFlameGuy') {
          velocity.y = 75;
          tweenXDuration = 400;
          tweenXDistance = 8;
        } else if (enemy.enemyType === 'spinningShip') {
          velocity.y = 60;

          // The spinning ship moves down until the player is within
          // perpendicular sight. It will move laterally towards the player
          // at this point.
          world.addEntityComponents(enemy, 'tagLateralHunter', true);
        } else if (enemy.enemyType === 'yellowShip') {
          velocity.y = 10;

          world.addEntityComponents(enemy, 'tagYellowShip', true);
        }

        // Only these two tween
        if (['greenAlien', 'redFlameGuy'].includes(enemy.enemyType)) {
          world.addEntityComponents(enemy, 'tweens', [
            ...(enemy.tweens ?? []).concat(tweens),
          ]);
        }

        world.addEntityComponents(enemy, 'direction', direction);
        world.addEntityComponents(enemy, 'velocity', velocity);
      });
    }
  };
}
