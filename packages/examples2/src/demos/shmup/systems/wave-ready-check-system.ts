import { World } from '@jakeklassen/ecs2';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';

export function waveReadyCheckSystemFactory({
  config,
  gameState,
  world,
}: {
  config: Config;
  gameState: GameState;
  world: World<Entity>;
}) {
  const enemies = world.archetype(
    'enemyDestination',
    'enemyState',
    'tagEnemy',
    'transform',
  );

  return () => {
    if (enemies.entities.size === 0 && gameState.waveReady === true) {
      world.createEntity({
        eventNextWave: true,
      });
    }

    if (enemies.entities.size === 0 || gameState.waveReady === true) {
      return;
    }

    const wave = config.waves[gameState.wave];

    if (wave == null) {
      return;
    }

    let waveReady = true;

    for (const entity of enemies.entities) {
      const { enemyDestination, transform } = entity;

      if (entity.enemyState === 'flyin') {
        waveReady = false;

        // When flying in we want to check if we are at the destination.
        // If we are, we want to remove the tweens and set the state to protect
        if (
          Math.abs(transform.position.y - enemyDestination.y) < Number.EPSILON
        ) {
          entity.enemyState = 'protect';

          if (entity.tagBoss === true) {
            console.log('👾 ready');
            entity.enemyState = 'bossReady';

            world.addEntityComponents(entity, 'direction', {
              x: 0,
              y: 0,
            });

            world.addEntityComponents(entity, 'velocity', {
              x: 0,
              y: 0,
            });
          }

          world.removeEntityComponents(entity, 'invulnerable');
        }
      }
    }

    gameState.waveReady = waveReady;
    gameState.bombLocked = !waveReady;
  };
}
