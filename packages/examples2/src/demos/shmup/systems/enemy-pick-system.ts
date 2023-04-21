import { rnd } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';

export function enemyPickSystemFactory({
  config,
  gameState,
  world,
}: {
  config: Config;
  gameState: GameState;
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
  let fireFrequencyTimer = 0;
  let nextFireTime = 0;

  return (dt: number) => {
    if (gameState.waveReady === false || enemies.entities.size === 0) {
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
