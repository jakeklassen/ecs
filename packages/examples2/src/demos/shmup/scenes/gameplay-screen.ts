import { rndFromList } from '#/lib/array.js';
import { rndInt } from '#/lib/math.js';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { resetGameState } from '../game-state.js';
import { Scene, SceneConstructorProps } from '../scene.js';
import { SpriteSheet } from '../spritesheet.js';
import { animationDetailsFactory } from '../structures/animation-details.js';
import { boundToViewportSystemFactory } from '../systems/bound-to-viewport-system.js';
import { debugRenderingSystemFactory } from '../systems/debug-rendering-system.js';
import { destroyOnViewportExitSystemFactory } from '../systems/destroy-on-viewport-exit-system.js';
import { hudRenderingSystemFactory } from '../systems/hud-rendering-system.js';
import { movementSystemFactory } from '../systems/movement-system.js';
import { muzzleFlashRenderingSystemFactory } from '../systems/muzzle-flash-rendering-system.js';
import { muzzleFlashSystemFactory } from '../systems/muzzle-flash-system.js';
import { playerSystemFactory } from '../systems/player-system.js';
import { renderingSystemFactory } from '../systems/rendering-system.js';
import { spriteAnimationSystemFactory } from '../systems/sprite-animation-system.js';
import { starfieldRenderingSystemFactory } from '../systems/starfield-rendering-system.js';
import { starfieldSystemFactory } from '../systems/starfield-system.js';
import { trackPlayerSystemFactory } from '../systems/track-player-system.js';
import { triggerGameOverSystemFactory } from '../systems/trigger-game-over-system.js';

export class GameplayScreen extends Scene {
  #areaWidth: number;
  #areaHeight: number;

  constructor(props: SceneConstructorProps) {
    super(props);

    this.#areaWidth = this.config.gameWidth - 1;
    this.#areaHeight = this.config.gameHeight - 1;

    this.systems.push(
      playerSystemFactory(
        this.world,
        this.input,
        SpriteSheet,
        this.audioManager,
      ),
      movementSystemFactory(this.world),
      trackPlayerSystemFactory(this.world),
      boundToViewportSystemFactory(this.world, {
        width: this.config.gameWidth,
        height: this.config.gameHeight,
      }),
      destroyOnViewportExitSystemFactory(this.world, {
        width: this.config.gameWidth,
        height: this.config.gameHeight,
      }),
      starfieldSystemFactory(this.world),
      muzzleFlashSystemFactory(this.world),
      spriteAnimationSystemFactory(this.world),
      starfieldRenderingSystemFactory(this.world, this.context),
      renderingSystemFactory(
        this.world,
        this.context,
        this.content.spritesheet,
      ),
      muzzleFlashRenderingSystemFactory(this.world, this.context),
      hudRenderingSystemFactory(this.gameState, this.content, this.context),
      debugRenderingSystemFactory(this.world, this.context, this.config),
      triggerGameOverSystemFactory(this.input, this),
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
    this.world.clearEntities();
    resetGameState(this.gameState);

    this.createStars(100);

    const player = this.world.createEntity({
      boundToViewport: true,
      boxCollider: SpriteSheet.player.boxCollider,
      direction: {
        x: 0,
        y: 0,
      },
      tagPlayer: true,
      transform: {
        position: {
          x: this.canvas.width / 2 - SpriteSheet.player.idle.width / 2,
          y: this.canvas.height * 0.9 - SpriteSheet.player.idle.height / 2,
        },
        rotation: 0,
        scale: {
          x: 1,
          y: 1,
        },
      },
      sprite: {
        frame: {
          sourceX: SpriteSheet.player.idle.sourceX,
          sourceY: SpriteSheet.player.idle.sourceY,
          width: SpriteSheet.player.idle.width,
          height: SpriteSheet.player.idle.height,
        },
        opacity: 1,
      },
      velocity: {
        x: 60,
        y: 60,
      },
    });

    this.world.createEntity({
      trackPlayer: {
        offset: {
          x: 0,
          y: SpriteSheet.player.idle.height,
        },
      },
      transform: {
        position: {
          x: player.transform.position.x,
          y: player.transform.position.y,
        },
        rotation: 0,
        scale: {
          x: 1,
          y: 1,
        },
      },
      sprite: {
        frame: {
          sourceX: SpriteSheet.player.thruster.sourceX,
          sourceY: SpriteSheet.player.thruster.sourceY,
          width: SpriteSheet.player.thruster.width,
          height: SpriteSheet.player.thruster.height,
        },
        opacity: 1,
      },
      spriteAnimation: spriteAnimationFactory(
        animationDetailsFactory(
          'player-thruster',
          SpriteSheet.player.thruster.animations.thrust.sourceX,
          SpriteSheet.player.thruster.animations.thrust.sourceY,
          SpriteSheet.player.thruster.animations.thrust.width,
          SpriteSheet.player.thruster.animations.thrust.height,
          SpriteSheet.player.thruster.animations.thrust.frameWidth,
          SpriteSheet.player.thruster.animations.thrust.frameHeight,
        ),
        100,
      ),
    });
  }

  public override enter(): void {
    super.enter();

    this.initialize();
  }

  public override exit(): void {
    super.exit();
  }

  public override update(delta: number): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    super.update(delta);
  }
}
