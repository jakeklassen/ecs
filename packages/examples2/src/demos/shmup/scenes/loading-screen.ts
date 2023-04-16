import { rndFromList } from '#/lib/array.js';
import { rndInt } from '#/lib/math.js';
import { Easing } from '#/lib/tween.js';
import { blinkAnimationFactory } from '../components/blink-animation.js';
import { transformFactory } from '../components/transform.js';
import { tweenFactory } from '../components/tween.js';
import { Pico8Colors } from '../constants.js';
import { resetGameState } from '../game-state.js';
import { Scene, SceneConstructorProps } from '../scene.js';
import { blinkAnimationSystemFactory } from '../systems/blink-animation-system.js';
import { eventSystemFactory } from '../systems/event-system.js';
import { movementSystemFactory } from '../systems/movement-system.js';
import { renderingSystemFactory } from '../systems/rendering-system.js';
import { spriteAnimationSystemFactory } from '../systems/sprite-animation-system.js';
import { starfieldRenderingSystemFactory } from '../systems/starfield-rendering-system.js';
import { starfieldSystemFactory } from '../systems/starfield-system.js';
import { textRenderingSystemFactory } from '../systems/text-rendering-system.js';
import { textSystemFactory } from '../systems/text-system.js';
import { tweenSystemFactory } from '../systems/tweens-system.js';

export class LoadingScreen extends Scene {
  #areaWidth: number;
  #areaHeight: number;

  constructor(props: SceneConstructorProps) {
    super(props);

    this.#areaWidth = this.config.gameWidth - 1;
    this.#areaHeight = this.config.gameHeight - 1;

    this.systems.push(
      textSystemFactory({
        fontCache: this.fontCache,
        textCache: this.textCache,
        world: this.world,
      }),
      blinkAnimationSystemFactory({
        textCache: this.textCache,
        world: this.world,
      }),
      tweenSystemFactory({ world: this.world }),
      starfieldSystemFactory({ world: this.world }),
      movementSystemFactory({ world: this.world }),
      spriteAnimationSystemFactory({ world: this.world }),
      eventSystemFactory({ world: this.world }),
      starfieldRenderingSystemFactory({
        world: this.world,
        context: this.context,
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

  private createStars(starCount = 100) {
    for (let i = 0; i < starCount; i++) {
      const entity = this.world.createEntity({
        direction: {
          x: 0,
          y: 1,
        },
        star: {
          color: 'white',
        },
        transform: transformFactory({
          position: {
            x: rndInt(this.#areaWidth, 1),
            y: rndInt(this.#areaHeight, 1),
          },
        }),
        velocity: {
          x: 0,
          y: rndFromList([60, 30, 20]),
        },
      });

      if (entity.velocity.y < 30) {
        entity.star.color = '#1d2b53';
      } else if (entity.velocity.y < 60) {
        entity.star.color = '#83769b';
      }
    }
  }

  public override initialize(): void {
    resetGameState(this.gameState);
    this.world.clearEntities();

    this.createStars(100);

    // Little green alien
    this.world.createEntity({
      sprite: {
        frame: {
          sourceX: this.spriteSheet.enemies.greenAlien.frame.sourceX,
          sourceY: this.spriteSheet.enemies.greenAlien.frame.sourceY,
          width: this.spriteSheet.enemies.greenAlien.frame.width,
          height: this.spriteSheet.enemies.greenAlien.frame.height,
        },
        opacity: 1,
      },
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
      sprite: {
        frame: {
          sourceX: this.spriteSheet.titleLogo.frame.sourceX,
          sourceY: this.spriteSheet.titleLogo.frame.sourceY,
          width: this.spriteSheet.titleLogo.frame.width,
          height: this.spriteSheet.titleLogo.frame.height,
        },
        opacity: 1,
      },
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

    // Interact to begin text
    this.world.createEntity({
      blinkAnimation: blinkAnimationFactory({
        colors: [Pico8Colors.Color5, Pico8Colors.Color6, Pico8Colors.Color7],
        colorSequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 0],
        durationMs: 500,
      }),
      text: {
        align: 'center',
        color: Pico8Colors.Color6,
        font: 'PICO-8',
        message: 'Interact To Begin',
      },
      transform: transformFactory({
        position: {
          x: this.canvas.width / 2,
          y: 90,
        },
      }),
    });
  }

  public override enter(): void {
    super.enter();

    this.initialize();
  }

  public override update(delta: number): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    super.update(delta);
  }
}