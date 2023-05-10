import { Easing } from '#/lib/tween.js';
import { spriteFactory } from '../components/sprite.js';
import { textBlinkAnimationFactory } from '../components/text-blink-animation.js';
import { transformFactory } from '../components/transform.js';
import { tweenFactory } from '../components/tween.js';
import { Pico8Colors } from '../constants.js';
import { starfieldFactory } from '../entity-factories/star.js';
import { resetGameState } from '../game-state.js';
import { Scene, SceneConstructorProps } from '../scene.js';
import { eventSystemFactory } from '../systems/event-system.js';
import { movementSystemFactory } from '../systems/movement-system.js';
import { spriteAnimationSystemFactory } from '../systems/sprite-animation-system.js';
import { spriteRenderingSystemFactory } from '../systems/sprite-rendering-system.js';
import { starfieldRenderingSystemFactory } from '../systems/starfield-rendering-system.js';
import { starfieldSystemFactory } from '../systems/starfield-system.js';
import { startGameSystemFactory } from '../systems/start-game-system.js';
import { textBlinkAnimationSystemFactory } from '../systems/text-blink-animation-system.js';
import { textRenderingSystemFactory } from '../systems/text-rendering-system.js';
import { textSystemFactory } from '../systems/text-system.js';
import { tweenSystemFactory } from '../systems/tweens-system.js';

export class TitleScreen extends Scene {
  #areaWidth: number;
  #areaHeight: number;

  constructor(props: SceneConstructorProps) {
    super(props);

    this.#areaWidth = this.config.gameWidth - 1;
    this.#areaHeight = this.config.gameHeight - 1;
  }

  public override initialize(): void {
    resetGameState(this.gameState);
    this.clearSystems();
    this.world.clearEntities();
    this.timer.clear();

    this.audioManager.play('title-screen-music', { loop: true });

    this.systems.push(
      textSystemFactory({
        fontCache: this.fontCache,
        textCache: this.textCache,
        world: this.world,
      }),
      textBlinkAnimationSystemFactory({
        textCache: this.textCache,
        world: this.world,
      }),
      tweenSystemFactory({ world: this.world }),
      starfieldSystemFactory({ world: this.world }),
      startGameSystemFactory({ controls: this.input, scene: this }),
      movementSystemFactory({ world: this.world }),
      spriteAnimationSystemFactory({ world: this.world }),
      eventSystemFactory({ world: this.world }),
      starfieldRenderingSystemFactory({
        world: this.world,
        context: this.context,
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

    starfieldFactory({
      areaHeight: this.#areaHeight,
      areaWidth: this.#areaWidth,
      count: 100,
      world: this.world,
    });

    // Little green alien
    this.world.createEntity({
      sprite: spriteFactory({
        frame: {
          sourceX: this.spriteSheet.enemies.greenAlien.frame.sourceX,
          sourceY: this.spriteSheet.enemies.greenAlien.frame.sourceY,
          width: this.spriteSheet.enemies.greenAlien.frame.width,
          height: this.spriteSheet.enemies.greenAlien.frame.height,
        },
      }),
      transform: transformFactory({
        position: {
          x:
            this.canvas.width / 2 -
            this.spriteSheet.enemies.greenAlien.frame.width / 2,
          y: 31,
        },
      }),
      tweens: [
        tweenFactory('transform.position.y', {
          duration: 1800,
          easing: Easing.Linear,
          from: 31,
          to: 24,
          maxIterations: Infinity,
          yoyo: true,
          // Interested in the end of the tween so we can randomize the x
          // position before it repeats.
          events: ['end'],
        }),
      ],
      tagStartScreenGreenAlien: true,
    });

    // Cherry Bomb logo
    this.world.createEntity({
      sprite: spriteFactory({
        frame: {
          sourceX: this.spriteSheet.titleLogo.frame.sourceX,
          sourceY: this.spriteSheet.titleLogo.frame.sourceY,
          width: this.spriteSheet.titleLogo.frame.width,
          height: this.spriteSheet.titleLogo.frame.height,
        },
      }),
      transform: transformFactory({
        position: {
          x: this.canvas.width / 2 - this.spriteSheet.titleLogo.frame.width / 2,
          y: 30,
        },
      }),
    });

    // V1 text
    this.world.createEntity({
      text: {
        color: Pico8Colors.Color1,
        font: 'PICO-8',
        message: 'V1',
      },
      transform: transformFactory({
        position: {
          x: 1,
          y: 1,
        },
      }),
    });

    // Short Shwave Shmup text
    this.world.createEntity({
      text: {
        align: 'center',
        color: Pico8Colors.Color6,
        font: 'PICO-8',
        message: 'Short Shwave Shmup',
      },
      transform: transformFactory({
        position: {
          x: this.canvas.width / 2,
          y: 45,
        },
      }),
    });

    // Press Any Key To Start text
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

    // High score text
    const highscoreString = localStorage.getItem('highscore');
    let highscore = parseInt(highscoreString ?? '0');

    if (highscore > 0) {
      this.world.createEntity({
        text: {
          align: 'center',
          color: Pico8Colors.Color12,
          font: 'PICO-8',
          message: `highscore:`,
        },
        transform: transformFactory({
          position: {
            x: this.canvas.width / 2,
            y: 63,
          },
        }),
      });

      this.world.createEntity({
        text: {
          align: 'center',
          color: Pico8Colors.Color12,
          font: 'PICO-8',
          message: `${highscore}`,
        },
        transform: transformFactory({
          position: {
            x: this.canvas.width / 2,
            y: 69,
          },
        }),
      });
    }
  }

  public override enter(): void {
    super.enter();

    this.initialize();
  }

  public override exit(): void {
    super.exit();

    this.audioManager.stopAll();
  }

  public override update(delta: number): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    super.update(delta);
  }
}
