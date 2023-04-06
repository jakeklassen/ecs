import { rndFromList } from '#/lib/array.js';
import { rndInt } from '#/lib/math.js';
import { CollisionMasks } from '../bitmasks.js';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { transformFactory } from '../components/transform.js';
import { resetGameState } from '../game-state.js';
import { Scene, SceneConstructorProps } from '../scene.js';
import { SpriteSheet } from '../spritesheet.js';
import { animationDetailsFactory } from '../structures/animation-details.js';
import { boundToViewportSystemFactory } from '../systems/bound-to-viewport-system.js';
import { collisionSystemFactory } from '../systems/collision-system.js';
import { debugRenderingSystemFactory } from '../systems/debug-rendering-system.js';
import { destroyOnViewportExitSystemFactory } from '../systems/destroy-on-viewport-exit-system.js';
import { flashSystemFactory } from '../systems/flash-system.js';
import { hudRenderingSystemFactory } from '../systems/hud-rendering-system.js';
import { invulnerableSystemFactory } from '../systems/invulnerable-system.js';
import { movementSystemFactory } from '../systems/movement-system.js';
import { muzzleFlashRenderingSystemFactory } from '../systems/muzzle-flash-rendering-system.js';
import { muzzleFlashSystemFactory } from '../systems/muzzle-flash-system.js';
import { particleRenderingSystemFactory } from '../systems/particle-rendering-system.js';
import { particleSystemFactory } from '../systems/particle-system.js';
import { playerEnemyCollisionEventCleanupSystemFactory } from '../systems/player-enemy-collision-event-cleanup-system.js';
import { playerEnemyCollisionEventSystemFactory } from '../systems/player-enemy-collision-event-system.js';
import { playerProjectileCollisionEventCleanupSystemFactory } from '../systems/player-projectile-collision-event-cleanup-system.js';
import { playerProjectileCollisionEventSystemFactory } from '../systems/player-projectile-collision-event-system.js';
import { playerSystemFactory } from '../systems/player-system.js';
import { renderingSystemFactory } from '../systems/rendering-system.js';
import { shockwaveRenderingSystemFactory } from '../systems/shockwave-rendering-system.js';
import { shockwaveSystemFactory } from '../systems/shockwave-system.js';
import { spriteAnimationSystemFactory } from '../systems/sprite-animation-system.js';
import { starfieldRenderingSystemFactory } from '../systems/starfield-rendering-system.js';
import { starfieldSystemFactory } from '../systems/starfield-system.js';
import { trackPlayerSystemFactory } from '../systems/track-player-system.js';
import { triggerGameOverSystemFactory } from '../systems/trigger-game-over-system.js';
import { tweenSystemFactory } from '../systems/tweens-system.js';

export class GameplayScreen extends Scene {
  #areaWidth: number;
  #areaHeight: number;

  constructor(props: SceneConstructorProps) {
    super(props);

    this.#areaWidth = this.config.gameWidth - 1;
    this.#areaHeight = this.config.gameHeight - 1;

    this.systems.push(
      playerSystemFactory({
        world: this.world,
        controls: this.input,
        spritesheet: SpriteSheet,
        audioManager: this.audioManager,
      }),
      movementSystemFactory({ world: this.world }),
      particleSystemFactory({ world: this.world }),
      shockwaveSystemFactory({ world: this.world }),
      trackPlayerSystemFactory({ world: this.world }),
      boundToViewportSystemFactory({
        world: this.world,
        viewport: {
          width: this.config.gameWidth,
          height: this.config.gameHeight,
        },
      }),
      destroyOnViewportExitSystemFactory({
        world: this.world,
        viewport: {
          width: this.config.gameWidth,
          height: this.config.gameHeight,
        },
      }),
      collisionSystemFactory({ world: this.world }),
      playerEnemyCollisionEventSystemFactory({
        world: this.world,
        audioManager: this.audioManager,
        config: this.config,
        gameState: this.gameState,
        scene: this,
      }),
      playerProjectileCollisionEventSystemFactory({
        world: this.world,
        audioManager: this.audioManager,
        gameState: this.gameState,
      }),
      tweenSystemFactory({ world: this.world }),
      invulnerableSystemFactory({ world: this.world }),
      starfieldSystemFactory({ world: this.world }),
      muzzleFlashSystemFactory({ world: this.world }),
      spriteAnimationSystemFactory({ world: this.world }),
      starfieldRenderingSystemFactory({
        world: this.world,
        context: this.context,
      }),
      flashSystemFactory({
        world: this.world,
        context: this.context,
        spriteSheet: this.content.spritesheet,
      }),
      renderingSystemFactory({
        world: this.world,
        context: this.context,
        spriteSheet: this.content.spritesheet,
      }),
      shockwaveRenderingSystemFactory({
        context: this.context,
        world: this.world,
      }),
      particleRenderingSystemFactory({
        world: this.world,
        context: this.context,
      }),
      muzzleFlashRenderingSystemFactory({
        world: this.world,
        context: this.context,
      }),
      hudRenderingSystemFactory({
        gameState: this.gameState,
        content: this.content,
        context: this.context,
      }),
      debugRenderingSystemFactory({
        world: this.world,
        context: this.context,
        config: this.config,
      }),
      triggerGameOverSystemFactory({ input: this.input, scene: this }),
      playerProjectileCollisionEventCleanupSystemFactory({ world: this.world }),
      playerEnemyCollisionEventCleanupSystemFactory({ world: this.world }),
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
      collisionLayer: CollisionMasks.Player,
      collisionMask: CollisionMasks.Enemy | CollisionMasks.EnemyProjectile,
      direction: {
        x: 0,
        y: 0,
      },
      tagPlayer: true,
      transform: {
        position: {
          x: this.config.entities.player.spawnPosition.x,
          y: this.config.entities.player.spawnPosition.y,
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

    // Player thruster
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
      tagPlayerThruster: true,
    });

    for (let y = 0; y < 5; y++) {
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          continue;
        }

        this.world.createEntity({
          boxCollider: SpriteSheet.enemies.greenAlien.boxCollider,
          collisionLayer: CollisionMasks.Enemy,
          collisionMask:
            CollisionMasks.PlayerProjectile | CollisionMasks.Player,
          health: this.config.entities.enemies.greenAlien.startingHealth,
          sprite: {
            frame: {
              sourceX: SpriteSheet.enemies.greenAlien.frame.sourceX,
              sourceY: SpriteSheet.enemies.greenAlien.frame.sourceY,
              width: SpriteSheet.enemies.greenAlien.frame.width,
              height: SpriteSheet.enemies.greenAlien.frame.height,
            },
            opacity: 1,
          },
          spriteAnimation: spriteAnimationFactory(
            animationDetailsFactory(
              'alien-idle',
              this.spriteSheet.enemies.greenAlien.animations.idle.sourceX,
              this.spriteSheet.enemies.greenAlien.animations.idle.sourceY,
              this.spriteSheet.enemies.greenAlien.animations.idle.width,
              this.spriteSheet.enemies.greenAlien.animations.idle.height,
              this.spriteSheet.enemies.greenAlien.animations.idle.frameWidth,
              this.spriteSheet.enemies.greenAlien.animations.idle.frameHeight,
            ),
            400,
            true,
          ),
          tagEnemy: true,
          transform: transformFactory({
            position: {
              x: 16 + i * 8 + 4,
              y: 16 + y * 2 + y * 8 + 4,
            },
          }),
        });
      }
    }
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
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    super.update(delta);
  }
}
