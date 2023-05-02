import { World } from '@jakeklassen/ecs2';
import { textBlinkAnimationFactory } from '../components/text-blink-animation.js';
import { transformFactory } from '../components/transform.js';
import { ttlFactory } from '../components/ttl.js';
import { Config } from '../config.js';
import { Pico8Colors } from '../constants.js';
import { spawnWave } from '../entity-factories/wave.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';
import { TimeSpan, Timer } from '../timer.js';

export function nextWaveEventSystemFactory({
  canvas,
  config,
  gameState,
  timer,
  world,
}: {
  canvas: HTMLCanvasElement;
  config: Config;
  gameState: GameState;
  timer: Timer;
  world: World<Entity>;
}) {
  const nextWaveEvents = world.archetype('eventNextWave');
  const maxMaves = Object.keys(config.waves).length;

  return (dt: number) => {
    const [entity] = nextWaveEvents.entities;

    if (entity == null) {
      return;
    }

    gameState.waveReady = false;
    gameState.wave++;

    const text: NonNullable<Entity['text']> = {
      align: 'center',
      color: Pico8Colors.Color6,
      font: 'PICO-8',
      message: '',
    };

    if (gameState.wave < maxMaves) {
      text.message = `Wave ${gameState.wave} of ${maxMaves}`;
    } else if (gameState.wave === maxMaves) {
      text.message = 'Final Wave!';
    } else {
      return;
    }

    const waveTextTTL = 2600;

    // Show next wave text
    world.createEntity({
      text,
      textBlinkAnimation: textBlinkAnimationFactory({
        colors: [Pico8Colors.Color5, Pico8Colors.Color6, Pico8Colors.Color7],
        colorSequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 0],
        durationMs: 500,
      }),
      transform: transformFactory({
        position: {
          x: canvas.width / 2,
          y: 40,
        },
      }),
      ttl: ttlFactory({
        durationMs: waveTextTTL,
      }),
    });

    if (gameState.wave > 1) {
      world.createEntity({
        eventPlaySound: {
          track: 'wave-complete',
          options: { loop: false },
        },
      });
    }

    const wave = config.waves[gameState.wave];

    if (wave == null) {
      console.warn('No more waves to spawn');
      return;
    }

    // Synchronize wave spawn with text destroy
    timer.add(new TimeSpan(waveTextTTL), () => {
      spawnWave({
        dt,
        timer,
        wave,
        world,
      });

      if (gameState.wave === gameState.maxWaves) {
        timer.add(new TimeSpan(500), () => {
          world.createEntity({
            eventPlaySound: {
              track: 'boss-music',
              options: { loop: true },
            },
          });
        });
      } else {
        world.createEntity({
          eventPlaySound: {
            track: 'wave-spawn',
            options: { loop: false },
          },
        });
      }
    });

    world.deleteEntity(entity);
  };
}
