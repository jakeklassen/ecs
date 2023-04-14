import { blinkAnimationFactory } from '../components/blink-animation.js';
import { transformFactory } from '../components/transform.js';
import { Pico8Colors } from '../constants.js';
import { Scene } from '../scene.js';
import { blinkAnimationSystemFactory } from '../systems/blink-animation-system.js';
import { blinkRenderingSystemFactory } from '../systems/blink-rendering-system.js';
import { gameOverSystemFactory } from '../systems/game-over-system.js';
import { renderingSystemFactory } from '../systems/rendering-system.js';
import { spriteAnimationSystemFactory } from '../systems/sprite-animation-system.js';
import { startGameSystemFactory } from '../systems/start-game-system.js';

export class GameOverScreen extends Scene {
  public override initialize(): void {
    this.audioManager.play('game-over', { loop: false });

    // Before the canvas gets cleared, copy the gameplay scene for a nice
    // background.
    const gameplayBuffer = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );

    this.world.clearEntities();

    // game over text
    this.world.createEntity({
      sprite: {
        frame: {
          sourceX: this.spriteSheet.text.gameOver.frame.sourceX,
          sourceY: this.spriteSheet.text.gameOver.frame.sourceY,
          width: this.spriteSheet.text.gameOver.frame.width,
          height: this.spriteSheet.text.gameOver.frame.height,
        },
        opacity: 1,
      },
      transform: {
        position: {
          x:
            this.canvas.width / 2 -
            this.spriteSheet.text.gameOver.frame.width / 2,
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
      sprite: {
        frame: {
          sourceX: this.spriteSheet.text.pressAnyKeyToStart.frame.sourceX,
          sourceY: this.spriteSheet.text.pressAnyKeyToStart.frame.sourceY,
          width: this.spriteSheet.text.pressAnyKeyToStart.frame.width,
          height: this.spriteSheet.text.pressAnyKeyToStart.frame.height,
        },
        opacity: 1,
      },
      blinkAnimation: blinkAnimationFactory({
        colors: [Pico8Colors.Color5, Pico8Colors.Color6, Pico8Colors.Color7],
        colorSequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 0],
        durationMs: 500,
      }),
      transform: transformFactory({
        position: {
          x:
            this.canvas.width / 2 -
            this.spriteSheet.text.pressAnyKeyToStart.frame.width / 2,
          y: 90,
        },
      }),
    });

    // We're initing system within initialize() because we need to pass in the
    // gameplayBuffer.
    // So we'll just clear all systems and re-add them.
    this.clearSystems();

    this.systems.push(
      startGameSystemFactory({ controls: this.input, scene: this }),
      blinkAnimationSystemFactory({ world: this.world }),
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
      blinkRenderingSystemFactory({
        context: this.context,
        world: this.world,
        spriteSheet: this.content.spritesheet,
      }),
    );
  }

  public override enter(): void {
    this.initialize();
  }

  public override update(delta: number): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    super.update(delta);
  }
}
