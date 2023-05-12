import { textBlinkAnimationFactory } from '../components/text-blink-animation.js';
import { transformFactory } from '../components/transform.js';
import { Pico8Colors } from '../constants.js';
import { Scene } from '../scene.js';
import { gameOverRenderingSystemFactory } from '../systems/game-over-rendering-system.js';
import { spriteAnimationSystemFactory } from '../systems/sprite-animation-system.js';
import { spriteRenderingSystemFactory } from '../systems/sprite-rendering-system.js';
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

    const highscoreString = localStorage.getItem('highscore');
    let highscore = parseInt(highscoreString ?? '0');

    if (this.gameState.score > highscore) {
      localStorage.setItem('highscore', `${this.gameState.score}`);
      highscore = this.gameState.score;

      // Show new high score text
      this.world.createEntity({
        text: {
          align: 'center',
          color: Pico8Colors.Color12,
          font: 'PICO-8',
          message: `new highscore!: ${highscore}`,
        },
        textBlinkAnimation: textBlinkAnimationFactory({
          colors: [Pico8Colors.Color7, Pico8Colors.Color10],
          colorSequence: [0, 1],
          durationMs: 100,
        }),
        transform: transformFactory({
          position: {
            x: this.canvas.width / 2,
            y: 66,
          },
        }),
      });
    }

    // Show high score text
    this.world.createEntity({
      text: {
        align: 'center',
        color: Pico8Colors.Color12,
        font: 'PICO-8',
        message: `score: ${highscore}`,
      },
      transform: transformFactory({
        position: {
          x: this.canvas.width / 2,
          y: 60,
        },
      }),
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
      startGameSystemFactory({ input: this.input, scene: this }),
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
      gameOverRenderingSystemFactory({
        context: this.context,
        imageData: gameplayBuffer,
      }),
      spriteRenderingSystemFactory({
        content: this.content,
        context: this.context,
        world: this.world,
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
