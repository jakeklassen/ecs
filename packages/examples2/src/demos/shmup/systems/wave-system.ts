import { AudioManager } from '#/lib/audio-manager.js';
import { World } from '@jakeklassen/ecs2';
import { blinkAnimationFactory } from '../components/blink-animation.js';
import { transformFactory } from '../components/transform.js';
import { Config } from '../config.js';
import { Pico8Colors } from '../constants.js';
import { Entity } from '../entity.js';
import { GameState } from '../game-state.js';

export function waveSystemFactory({
  audioManager,
  canvas,
  config,
  gameState,
  world,
}: {
  audioManager: AudioManager;
  canvas: HTMLCanvasElement;
  config: Config;
  gameState: GameState;
  world: World<Entity>;
}) {
  const nextWaveEvents = world.archetype('eventNextWave');
  const maxMaves = Object.keys(config.waves).length;

  return () => {
    const [entity] = nextWaveEvents.entities;

    if (entity == null) {
      return;
    }

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

    // Show next wave text
    world.createEntity({
      blinkAnimation: blinkAnimationFactory({
        colors: [Pico8Colors.Color5, Pico8Colors.Color6, Pico8Colors.Color7],
        colorSequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 0],
        durationMs: 500,
      }),
      text,
      transform: transformFactory({
        position: {
          x: canvas.width / 2,
          y: 40,
        },
      }),
      ttl: {
        durationMs: 2600,
        elapsedMs: 0,
        onComplete: 'remove',
        trigger: `nextWave:${gameState.wave}`,
      },
    });

    if (gameState.wave > 1) {
      audioManager.play('wave-complete', { loop: false });
    }

    world.deleteEntity(entity);
  };
}
