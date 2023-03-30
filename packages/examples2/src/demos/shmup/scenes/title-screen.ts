import { resetGameState } from '../game-state.js';
import { Scene, SceneConstructorProps } from '../scene.js';
import { movementSystemFactory } from '../systems/movement-system.js';
import { renderingSystemFactory } from '../systems/rendering-system.js';
import { starfieldRenderingSystemFactory } from '../systems/starfield-rendering-system.js';
import { starfieldSystemFactory } from '../systems/starfield-system.js';
import { startGameSystemFactory } from '../systems/start-game-system.js';

export class TitleScreen extends Scene {
  constructor(props: SceneConstructorProps) {
    super(props);

    this.systems.push(
      starfieldSystemFactory(
        this.world,
        this.canvas.width - 1,
        this.canvas.height - 1,
        100,
      ),
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

  public override initialize(): void {
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
    resetGameState(this.gameState);
  }

  public override update(delta: number): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    super.update(delta);
  }
}
