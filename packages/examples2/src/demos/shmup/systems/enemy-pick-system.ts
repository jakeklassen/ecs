import { rndInt } from '#/lib/math.js';
import { Easing } from '#/lib/tween.js';
import { World } from '@jakeklassen/ecs2';
import { tweenFactory } from '../components/tween.js';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';
import { Timer } from '../timer.js';

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
    'tagEnemy',
    'transform',
  );

  let attackFrequencyTimer = 0;
  let fireFrequencyTimer = 0;

  return (dt: number) => {
    if (gameState.waveReady === false) {
      return;
    }

    const wave = config.waves[gameState.wave];

    if (wave == null) {
      return;
    }

    if (enemies.entities.size === 0) {
      world.createEntity({
        eventNextWave: true,
      });
    }

    // Sort by position using x and y, from left to right, top to bottom
    // All y positions should be grouped together
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

      let startDirection = Math.random() < 0.5 ? 1 : -1;

      const max = Math.min(enemies.entities.size, 10);
      const randomIndex = rndInt(max, 1);
      const enemyIndex = enemies.entities.size - randomIndex;
      const enemy = enemiesArray[enemyIndex];

      if (enemy == null || enemy.enemyState === 'attack') {
        return;
      }

      if (enemy.enemyType === 'boss' || enemy.enemyType === 'yellowShip') {
        return;
      }

      enemy.enemyState = 'attack';

      const direction = {
        // -1 is right, 1 is left
        x: startDirection === 1 ? 1 : -1,
        y: 1,
      };

      const tweens = [];

      if (enemy.transform.position.x < 16) {
        // Always start to the right
        startDirection = 1;

        tweens.push(
          tweenFactory('transform.position.x', {
            duration: 700,
            easing: Easing.InSine,
            from: enemy.transform.position.x,
            to: enemy.transform.position.x + 24,
          }),
          tweenFactory('transform.position.x', {
            delay: 700,
            duration: 800,
            easing: Easing.InSine,
            from: enemy.transform.position.x + 24,
            to: enemy.transform.position.x + 24 - 16,
            fullSwing: true,
            yoyo: true,
            maxIterations: Infinity,
          }),
        );
      } else if (enemy.transform.position.x > 104) {
        // Always start to the left
        startDirection = -1;
        tweens.push(
          tweenFactory('transform.position.x', {
            duration: 700,
            easing: Easing.InSine,
            from: enemy.transform.position.x,
            to: enemy.transform.position.x - 24,
          }),
          tweenFactory('transform.position.x', {
            delay: 700,
            duration: 800,
            easing: Easing.InSine,
            from: enemy.transform.position.x - 24,
            to: enemy.transform.position.x - 24 + 16,
            fullSwing: true,
            yoyo: true,
            maxIterations: Infinity,
          }),
        );
      } else {
        startDirection = startDirection === 1 ? 1 : -1;

        tweens.push(
          tweenFactory('transform.position.x', {
            duration: 800,
            easing: Easing.InSine,
            from: enemy.transform.position.x,
            to: enemy.transform.position.x + startDirection * 16,
            fullSwing: true,
            yoyo: true,
            maxIterations: Infinity,
          }),
        );
      }

      world.addEntityComponents(enemy, 'tweens', [
        ...(enemy.tweens ?? []).concat(tweens),
      ]);

      const velocity = {
        x: 0,
        y: 51,
      };

      world.addEntityComponents(enemy, 'direction', direction);
      world.addEntityComponents(enemy, 'velocity', velocity);
    }
  };
}
