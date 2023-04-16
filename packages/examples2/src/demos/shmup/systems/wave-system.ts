import { World } from '@jakeklassen/ecs2';
import { GameState } from '../game-state.js';
import { Entity } from '../entity.js';
import { Config } from '../config.js';
import { blinkAnimationFactory } from '../components/blink-animation.js';
import { Pico8Colors } from '../constants.js';
import { transformFactory } from '../components/transform.js';

export function waveSystemFactory({
  canvas,
  config,
  gameState,
  world,
}: {
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
      // game is over
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
        durationMs: 3000,
        elapsedMs: 0,
        onComplete: 'remove',
        trigger: `nextWave:${gameState.wave}`,
      },
    });

    world.deleteEntity(entity);
  };
}
