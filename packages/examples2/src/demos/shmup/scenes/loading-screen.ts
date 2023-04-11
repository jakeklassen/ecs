import { rndFromList } from '#/lib/array.js';
import { rndInt } from '#/lib/math.js';
import { Easing } from '#/lib/tween.js';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { transformFactory } from '../components/transform.js';
import { tweenFactory } from '../components/tween.js';
import { resetGameState } from '../game-state.js';
import { Scene, SceneConstructorProps } from '../scene.js';
import { animationDetailsFactory } from '../structures/animation-details.js';
import { eventSystemFactory } from '../systems/event-system.js';
import { movementSystemFactory } from '../systems/movement-system.js';
import { renderingSystemFactory } from '../systems/rendering-system.js';
import { spriteAnimationSystemFactory } from '../systems/sprite-animation-system.js';
import { starfieldRenderingSystemFactory } from '../systems/starfield-rendering-system.js';
import { starfieldSystemFactory } from '../systems/starfield-system.js';
import { startGameSystemFactory } from '../systems/start-game-system.js';
import { tweenSystemFactory } from '../systems/tweens-system.js';

export class LoadingScreen extends Scene {
  #areaWidth: number;
  #areaHeight: number;

  constructor(props: SceneConstructorProps) {
    super(props);

    this.#areaWidth = this.config.gameWidth - 1;
    this.#areaHeight = this.config.gameHeight - 1;

    this.systems.push(
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
      renderingSystemFactory({
        world: this.world,
        context: this.context,
        spriteSheet: this.content.spritesheet,
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

    // V1 image
    this.world.createEntity({
      sprite: {
        frame: {
          sourceX: this.spriteSheet.text.v1.frame.sourceX,
          sourceY: this.spriteSheet.text.v1.frame.sourceY,
          width: this.spriteSheet.text.v1.frame.width,
          height: this.spriteSheet.text.v1.frame.height,
        },
        opacity: 1,
      },
      transform: transformFactory({
        position: {
          x: 1,
          y: 1,
        },
      }),
    });

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

    // Short Shwave Shmup text
    this.world.createEntity({
      sprite: {
        frame: {
          sourceX: this.spriteSheet.text.shortShwaveShmup.frame.sourceX,
          sourceY: this.spriteSheet.text.shortShwaveShmup.frame.sourceY,
          width: this.spriteSheet.text.shortShwaveShmup.frame.width,
          height: this.spriteSheet.text.shortShwaveShmup.frame.height,
        },
        opacity: 1,
      },
      transform: transformFactory({
        position: {
          x:
            this.canvas.width / 2 -
            this.spriteSheet.text.shortShwaveShmup.frame.width / 2,
          y: 45,
        },
      }),
    });

    // Click to begin text
    this.world.createEntity({
      sprite: {
        frame: {
          sourceX: this.spriteSheet.text.clickToBegin.frame.sourceX,
          sourceY: this.spriteSheet.text.clickToBegin.frame.sourceY,
          width: this.spriteSheet.text.clickToBegin.frame.width,
          height: this.spriteSheet.text.clickToBegin.frame.height,
        },
        opacity: 1,
      },
      spriteAnimation: spriteAnimationFactory(
        animationDetailsFactory(
          'press-x-to-start-blink',
          this.spriteSheet.text.clickToBegin.animations.blink.sourceX,
          this.spriteSheet.text.clickToBegin.animations.blink.sourceY,
          this.spriteSheet.text.clickToBegin.animations.blink.width,
          this.spriteSheet.text.clickToBegin.animations.blink.height,
          this.spriteSheet.text.clickToBegin.animations.blink.frameWidth,
          this.spriteSheet.text.clickToBegin.animations.blink.frameHeight,
        ),
        500,
        true,
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 0],
      ),
      transform: transformFactory({
        position: {
          x:
            this.canvas.width / 2 -
            this.spriteSheet.text.clickToBegin.frame.width / 2,
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
