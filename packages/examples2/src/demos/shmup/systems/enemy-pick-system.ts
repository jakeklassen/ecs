import { rnd } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';

/**
 * This system is responsible for picking when enemies should attack and fire.
 */
export function enemyPickSystemFactory({
  config,
  gameState,
  world,
}: {
  config: Config;
  gameState: GameState;
  world: World<Entity>;
}) {
  let attackFrequencyTimer = 0;
  let fireFrequencyTimer = 0;
  let nextFireTime = 0;

  return function enemyPickSystem(dt: number) {
    if (gameState.waveReady === false) {
      return;
    }

    const wave = config.waves[gameState.wave];

    if (wave == null) {
      return;
    }

    attackFrequencyTimer += dt;
    fireFrequencyTimer += dt;

    if (attackFrequencyTimer >= wave.attackFrequency) {
      attackFrequencyTimer = 0;

      world.createEntity({
        eventTriggerEnemyAttack: true,
      });
    }

    if (fireFrequencyTimer > nextFireTime) {
      fireFrequencyTimer = 0;
      nextFireTime = wave.fireFrequency + rnd(wave.fireFrequency);

      world.createEntity({
        eventTriggerEnemyFire: true,
      });
    }
  };
}
