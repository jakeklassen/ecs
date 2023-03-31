import { rndFromList } from '#/lib/array.js';
import { rndInt } from '#/lib/math.js';
import { resetGameState } from '../game-state.js';
import { Scene, SceneConstructorProps } from '../scene.js';
import { movementSystemFactory } from '../systems/movement-system.js';
import { renderingSystemFactory } from '../systems/rendering-system.js';
import { starfieldRenderingSystemFactory } from '../systems/starfield-rendering-system.js';
import { starfieldSystemFactory } from '../systems/starfield-system.js';
import { startGameSystemFactory } from '../systems/start-game-system.js';

export class TitleScreen extends Scene {
  #areaWidth: number;
  #areaHeight: number;

  constructor(props: SceneConstructorProps) {
    super(props);

    this.#areaWidth = this.config.gameWidth - 1;
    this.#areaHeight = this.config.gameHeight - 1;

    this.systems.push(
      starfieldSystemFactory(this.world),
      startGameSystemFactory(this.input, this),
      movementSystemFactory(this.world),
      starfieldRenderingSystemFactory(this.world, this.context),
      renderingSystemFactory(
        this.world,
        this.context,
        this.content.spritesheet,
      ),
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
        transform: {
          position: {
            x: rndInt(this.#areaWidth, 1),
            y: rndInt(this.#areaHeight, 1),
          },
          rotation: 0,
          scale: {
            x: 1,
            y: 1,
          },
        },
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

    this.createStars(100);

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
      transform: {
        position: {
          x:
            this.canvas.width / 2 -
            this.spriteSheet.text.pressAnyKeyToStart.frame.width / 2,
          y: this.canvas.height / 2,
        },
        rotation: 0,
        scale: {
          x: 1,
          y: 1,
        },
      },
    });
  }

  public override enter(): void {
    super.enter();

    this.initialize();
  }

  public override update(delta: number): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    super.update(delta);
  }
}
