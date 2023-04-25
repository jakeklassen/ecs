import { CollisionMasks } from '../bitmasks.js';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { transformFactory } from '../components/transform.js';
import { Pico8Colors } from '../constants.js';
import { starfieldFactory } from '../entity-factories/star.js';
import { resetGameState } from '../game-state.js';
import { Scene, SceneConstructorProps } from '../scene.js';
import { SpriteSheet } from '../spritesheet.js';
import { animationDetailsFactory } from '../structures/animation-details.js';
import { bombSystemFactory } from '../systems/bomb-system.js';
import { boundToViewportSystemFactory } from '../systems/bound-to-viewport-system.js';
import { cameraShakeSystemFactory } from '../systems/camera-shake-system.js';
import { cherrySystemFactory } from '../systems/cherry-system.js';
import { collisionSystemFactory } from '../systems/collision-system.js';
import { debugRenderingSystemFactory } from '../systems/debug-rendering-system.js';
import { destroyOnViewportExitSystemFactory } from '../systems/destroy-on-viewport-exit-system.js';
import { enemyPickSystemFactory } from '../systems/enemy-pick-system.js';
import { flashSystemFactory } from '../systems/flash-system.js';
import { handleGameOverSystemFactory } from '../systems/handle-game-over-system.js';
import { handleGameWonSystemFactory } from '../systems/handle-game-won-system.js';
import { invulnerableSystemFactory } from '../systems/invulnerable-system.js';
import { lateralHunterSystemFactory } from '../systems/lateral-hunter-system.js';
import { livesRenderingSystemFactory } from '../systems/lives-rendering-system.js';
import { movementSystemFactory } from '../systems/movement-system.js';
import { muzzleFlashRenderingSystemFactory } from '../systems/muzzle-flash-rendering-system.js';
import { muzzleFlashSystemFactory } from '../systems/muzzle-flash-system.js';
import { nextWaveEventSystemFactory } from '../systems/next-wave-event-system.js';
import { particleRenderingSystemFactory } from '../systems/particle-rendering-system.js';
import { particleSystemFactory } from '../systems/particle-system.js';
import { playerEnemyCollisionEventCleanupSystemFactory } from '../systems/player-enemy-collision-event-cleanup-system.js';
import { playerEnemyCollisionEventSystemFactory } from '../systems/player-enemy-collision-event-system.js';
import { playerProjectileCollisionEventCleanupSystemFactory } from '../systems/player-projectile-collision-event-cleanup-system.js';
import { playerProjectileCollisionEventSystemFactory } from '../systems/player-projectile-collision-event-system.js';
import { playerSystemFactory } from '../systems/player-system.js';
import { renderingSystemFactory } from '../systems/rendering-system.js';
import { scoreSystemFactory } from '../systems/score-system.js';
import { shockwaveRenderingSystemFactory } from '../systems/shockwave-rendering-system.js';
import { shockwaveSystemFactory } from '../systems/shockwave-system.js';
import { soundSystemFactory } from '../systems/sound-system.js';
import { spriteAnimationSystemFactory } from '../systems/sprite-animation-system.js';
import { spriteRenderingSystemFactory } from '../systems/sprite-rendering-system.js';
import { starfieldRenderingSystemFactory } from '../systems/starfield-rendering-system.js';
import { starfieldSystemFactory } from '../systems/starfield-system.js';
import { textBlinkAnimationSystemFactory } from '../systems/text-blink-animation-system.js';
import { textRenderingSystemFactory } from '../systems/text-rendering-system.js';
import { textSystemFactory } from '../systems/text-system.js';
import { timeToLiveSystemFactory } from '../systems/time-to-live-system.js';
import { timerSystemFactory } from '../systems/timer-system.js';
import { trackPlayerSystemFactory } from '../systems/track-player-system.js';
import { triggerEnemyAttackEventSystemFactory } from '../systems/trigger-enemy-attack-event-system.js';
import { triggerEnemyFireEventSystemFactory } from '../systems/trigger-enemy-fire-event-system.js';
import { triggerGameOverSystemFactory } from '../systems/trigger-game-over-system.js';
import { triggerGameWonSystemFactory } from '../systems/trigger-game-won-system.js';
import { tweenSystemFactory } from '../systems/tweens-system.js';
import { waveReadyCheckSystemFactory } from '../systems/wave-ready-check-system.js';
import { yellowShipSystemFactory } from '../systems/yellow-ship-system.js';

export class GameplayScreen extends Scene {
  #areaWidth: number;
  #areaHeight: number;
  #bufferCanvas = document.createElement('canvas');
  #bufferContext = this.#bufferCanvas.getContext('2d')!;
  #camera = { x: 0, y: 0 };

  constructor(props: SceneConstructorProps) {
    super(props);

    this.#areaWidth = this.config.gameWidth - 1;
    this.#areaHeight = this.config.gameHeight - 1;

    this.#bufferCanvas.width = this.canvas.width;
    this.#bufferCanvas.height = this.canvas.height;
    this.#bufferContext.imageSmoothingEnabled = false;
  }

  public override initialize(): void {
    resetGameState(this.gameState);
    this.clearSystems();
    this.world.clearEntities();
    this.timer.clear();

    this.systems.push(
      timerSystemFactory({ timer: this.timer }),
      waveReadyCheckSystemFactory({
        config: this.config,
        gameState: this.gameState,
        world: this.world,
      }),
      nextWaveEventSystemFactory({
        canvas: this.canvas,
        config: this.config,
        gameState: this.gameState,
        timer: this.timer,
        world: this.world,
      }),
      bombSystemFactory({
        gameState: this.gameState,
        timer: this.timer,
        world: this.world,
      }),
      enemyPickSystemFactory({
        config: this.config,
        gameState: this.gameState,
        world: this.world,
      }),
      triggerEnemyAttackEventSystemFactory({
        timer: this.timer,
        world: this.world,
      }),
      triggerEnemyFireEventSystemFactory({
        world: this.world,
      }),
      timeToLiveSystemFactory({
        world: this.world,
      }),
      textSystemFactory({
        fontCache: this.fontCache,
        textCache: this.textCache,
        world: this.world,
      }),
      textBlinkAnimationSystemFactory({
        textCache: this.textCache,
        world: this.world,
      }),
      playerSystemFactory({
        controls: this.input,
        gameState: this.gameState,
        spritesheet: SpriteSheet,
        world: this.world,
      }),
      lateralHunterSystemFactory({
        timer: this.timer,
        world: this.world,
      }),
      yellowShipSystemFactory({
        world: this.world,
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
        config: this.config,
        gameState: this.gameState,
      }),
      playerProjectileCollisionEventSystemFactory({
        world: this.world,
        gameState: this.gameState,
      }),
      tweenSystemFactory({ world: this.world }),
      invulnerableSystemFactory({ world: this.world }),
      starfieldSystemFactory({ world: this.world }),
      muzzleFlashSystemFactory({ world: this.world }),
      spriteAnimationSystemFactory({ world: this.world }),
      starfieldRenderingSystemFactory({
        world: this.world,
        context: this.#bufferContext,
      }),
      flashSystemFactory({
        world: this.world,
        context: this.#bufferContext,
        spriteSheet: this.content.spritesheet,
      }),
      cherrySystemFactory({
        gameState: this.gameState,
        textCache: this.textCache,
        world: this.world,
      }),
      scoreSystemFactory({
        gameState: this.gameState,
        textCache: this.textCache,
        world: this.world,
      }),
      soundSystemFactory({
        audioManager: this.audioManager,
        world: this.world,
      }),
      spriteRenderingSystemFactory({
        context: this.#bufferContext,
        spriteSheet: this.content.spritesheet,
        world: this.world,
      }),
      shockwaveRenderingSystemFactory({
        context: this.#bufferContext,
        world: this.world,
      }),
      particleRenderingSystemFactory({
        world: this.world,
        context: this.#bufferContext,
      }),
      muzzleFlashRenderingSystemFactory({
        world: this.world,
        context: this.#bufferContext,
      }),
      livesRenderingSystemFactory({
        gameState: this.gameState,
        content: this.content,
        context: this.#bufferContext,
      }),
      textRenderingSystemFactory({
        context: this.#bufferContext,
        textCache: this.textCache,
        world: this.world,
      }),
      debugRenderingSystemFactory({
        world: this.world,
        context: this.#bufferContext,
        config: this.config,
      }),
      triggerGameOverSystemFactory({ input: this.input, scene: this }),
      triggerGameWonSystemFactory({ input: this.input, scene: this }),
      playerProjectileCollisionEventCleanupSystemFactory({ world: this.world }),
      playerEnemyCollisionEventCleanupSystemFactory({ world: this.world }),
      handleGameOverSystemFactory({
        scene: this,
        gameState: this.gameState,
        world: this.world,
      }),
      handleGameWonSystemFactory({
        scene: this,
        gameState: this.gameState,
        world: this.world,
      }),
      cameraShakeSystemFactory({
        camera: this.#camera,
        world: this.world,
      }),
      renderingSystemFactory({
        buffer: this.#bufferCanvas,
        camera: this.#camera,
        context: this.context,
      }),
    );

    starfieldFactory({
      areaHeight: this.#areaHeight,
      areaWidth: this.#areaWidth,
      count: 100,
      world: this.world,
    });

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

    this.world.createEntity({
      transform: transformFactory({
        position: {
          x: 108,
          y: 1,
        },
      }),
      sprite: {
        frame: {
          sourceX: SpriteSheet.cherry.frame.sourceX,
          sourceY: SpriteSheet.cherry.frame.sourceY,
          width: SpriteSheet.cherry.frame.width,
          height: SpriteSheet.cherry.frame.height,
        },
        opacity: 1,
      },
    });

    // Score text
    this.world.createEntity({
      tagTextScore: true,
      text: {
        color: Pico8Colors.Color12,
        font: 'PICO-8',
        message: `Score:${this.gameState.score}`,
      },
      transform: transformFactory({
        position: {
          x: 40,
          y: 2,
        },
      }),
    });

    // Cherries text
    this.world.createEntity({
      tagTextCherries: true,
      text: {
        color: Pico8Colors.Color14,
        font: 'PICO-8',
        message: `${this.gameState.cherries}`,
      },
      transform: transformFactory({
        position: {
          x: 118,
          y: 2,
        },
      }),
    });

    this.world.createEntity({
      eventNextWave: true,
    });

    this.audioManager.play('game-start', { loop: false });
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
    this.#bufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.#bufferContext.fillStyle = 'black';
    this.#bufferContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

    super.update(delta);

    // // shake screen randomly within unit circle
    // const offsetX = 2 * (Math.random() - 0.5);
    // const offsetY = 2 * (Math.random() - 0.5);
    // this.context.translate(offsetX, offsetY);

    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.context.fillStyle = 'black';
    // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // this.context.drawImage(this.#bufferCanvas, 0, 0);

    // this.context.resetTransform();
  }
}
