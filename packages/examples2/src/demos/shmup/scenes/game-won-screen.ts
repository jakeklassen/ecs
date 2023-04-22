import { textBlinkAnimationFactory } from '../components/text-blink-animation.js';
import { transformFactory } from '../components/transform.js';
import { Pico8Colors } from '../constants.js';
import { Scene } from '../scene.js';
import { gameOverSystemFactory } from '../systems/game-over-system.js';
import { renderingSystemFactory } from '../systems/rendering-system.js';
import { spriteAnimationSystemFactory } from '../systems/sprite-animation-system.js';
import { startGameSystemFactory } from '../systems/start-game-system.js';
import { textBlinkAnimationSystemFactory } from '../systems/text-blink-animation-system.js';
import { textRenderingSystemFactory } from '../systems/text-rendering-system.js';
import { textSystemFactory } from '../systems/text-system.js';

export class GameWonScreen extends Scene {
  public override initialize(): void {
    this.clearSystems();
    this.world.clearEntities();
    this.timer.clear();

    this.audioManager.play('game-won', { loop: false });

    // Before the canvas gets cleared, copy the gameplay scene for a nice
    // background.
    const gameplayBuffer = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );

    // game over text
    this.world.createEntity({
      text: {
        align: 'center',
        color: Pico8Colors.Color12,
        font: 'PICO-8',
        message: 'Congratulations',
      },
      transform: {
        position: {
          x: this.canvas.width / 2,
          y: 40,
        },
        rotation: 0,
        scale: {
          x: 1,
          y: 1,
        },
      },
    });

    // Press any key to start text
    this.world.createEntity({
      text: {
        align: 'center',
        color: Pico8Colors.Color6,
        font: 'PICO-8',
        message: 'Press Any Key To Start',
      },
      textBlinkAnimation: textBlinkAnimationFactory({
        colors: [Pico8Colors.Color5, Pico8Colors.Color6, Pico8Colors.Color7],
        colorSequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 0],
        durationMs: 500,
      }),
      transform: transformFactory({
        position: {
          x: this.canvas.width / 2,
          y: 90,
        },
      }),
    });

    this.systems.push(
      startGameSystemFactory({ controls: this.input, scene: this }),
      textSystemFactory({
        fontCache: this.fontCache,
        textCache: this.textCache,
        world: this.world,
      }),
      textBlinkAnimationSystemFactory({
        textCache: this.textCache,
        world: this.world,
      }),
      spriteAnimationSystemFactory({ world: this.world }),
      gameOverSystemFactory({
        context: this.context,
        imageData: gameplayBuffer,
      }),
      renderingSystemFactory({
        world: this.world,
        context: this.context,
        spriteSheet: this.content.spritesheet,
      }),
      textRenderingSystemFactory({
        context: this.context,
        textCache: this.textCache,
        world: this.world,
      }),
    );
  }

  public override enter(): void {
    this.initialize();
  }

  public override exit(): void {
    this.audioManager.stopAll();
  }

  public override update(delta: number): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    super.update(delta);
  }
}