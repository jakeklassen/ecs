import { AudioManager } from '#/lib/audio-manager.js';
import { Easing } from '#/lib/tween.js';
import { World } from '@jakeklassen/ecs2';
import { transformFactory } from '../components/transform.js';
import { tweenFactory } from '../components/tween.js';
import { Config } from '../config.js';
import {
  bossFactory,
  greenAlienFactory,
  redFlameGuyFactory,
  spinningShipFactory,
  yellowShipFactory,
} from '../entity-factories/enemy.js';
import { Entity } from '../entity.js';
import { gameState } from '../game-state.js';
import { TimeSpan, Timer } from '../timer.js';

function isValidWaveNumber(
  waveNumber: number,
  config: Config,
): waveNumber is keyof typeof config.waves {
  return waveNumber in config.waves;
}

export function spawnWaveSystemFactory({
  audioManager,
  config,
  timer,
  world,
}: {
  audioManager: AudioManager;
  config: Config;
  timer: Timer;
  world: World<Entity>;
}) {
  const nextWaveEvents = world.archetype('eventSpawnWave');
  const maxMaves = Object.keys(config.waves).length;

  return (dt: number) => {
    const [entity] = nextWaveEvents.entities;

    if (entity == null) {
      return;
    }

    const waveNumber = entity.eventSpawnWave.waveNumber;

    if (waveNumber > maxMaves) {
      return;
    }

    if (!isValidWaveNumber(waveNumber, config)) {
      throw new Error(`Invalid wave number: ${waveNumber}`);
    }

    const wave = config.waves[waveNumber];

    for (let y = 0; y < wave.enemies.length; y++) {
      const line = wave.enemies[y];

      for (let x = 0; x < 10; x++) {
        const enemyType = line[x];

        if (enemyType === 0) {
          continue;
        }

        const toXPosition = (x + 1) * 12 - 6;
        const fromXPosition = toXPosition * 1.25 - 16;

        const toYPosition = 4 + (y + 1) * 12;
        const fromYPosition = toYPosition - 66;

        const transform = transformFactory({
          position: {
            x: fromXPosition,
            y: fromYPosition,
          },
        });

        const tweenDuration = 800;

        const tweenXPosition = tweenFactory('transform.position.x', {
          from: fromXPosition,
          to: toXPosition,
          duration: tweenDuration,
          easing: Easing.OutSine,
        });

        const tweenYPosition = tweenFactory('transform.position.y', {
          from: fromYPosition,
          to: toYPosition,
          duration: tweenDuration,
          easing: Easing.OutSine,
        });

        const tweens = [tweenXPosition, tweenYPosition];

        const wait = (x + 1) * 3 * dt;

        if (enemyType === 1) {
          timer.add(new TimeSpan(wait), () => {
            const entity = greenAlienFactory({
              components: {
                transform,
                tweens,
              },
              world,
            });

            timer.add(new TimeSpan(tweenDuration), () => {
              world.removeEntityComponents(entity, 'invulnerable');
            });
          });
        } else if (enemyType === 2) {
          timer.add(new TimeSpan(wait), () => {
            const entity = redFlameGuyFactory({
              components: {
                transform,
                tweens,
              },
              world,
            });

            timer.add(new TimeSpan(tweenDuration), () => {
              world.removeEntityComponents(entity, 'invulnerable');
            });
          });
        } else if (enemyType === 3) {
          timer.add(new TimeSpan(wait), () => {
            const entity = spinningShipFactory({
              components: {
                transform,
                tweens,
              },
              world,
            });

            timer.add(new TimeSpan(tweenDuration), () => {
              world.removeEntityComponents(entity, 'invulnerable');
            });
          });
        } else if (enemyType === 4) {
          timer.add(new TimeSpan(wait), () => {
            const entity = yellowShipFactory({
              components: {
                transform,
                tweens,
              },
              world,
            });

            timer.add(new TimeSpan(tweenDuration), () => {
              world.removeEntityComponents(entity, 'invulnerable');
            });
          });
        } else if (enemyType === 5) {
          timer.add(new TimeSpan(wait), () => {
            const entity = bossFactory({
              components: {
                transform,
                tweens,
              },
              world,
            });

            timer.add(new TimeSpan(tweenDuration), () => {
              world.removeEntityComponents(entity, 'invulnerable');
            });
          });
        }
      }
    }

    audioManager.play('wave-spawn', { loop: false });

    if (waveNumber === gameState.maxWaves) {
      timer.add(new TimeSpan(1000), () => {
        audioManager.play('boss-music', { loop: true });
      });
    }

    world.deleteEntity(entity);
  };
}
