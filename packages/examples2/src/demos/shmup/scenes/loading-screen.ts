import { Easing } from '#/lib/tween.js';
import bigExplosionAudioUrl from '../assets/audio/big-explosion.ogg';
import bossMusicAudioUrl from '../assets/audio/boss-music.ogg';
import bossProjectileAudioUrl from '../assets/audio/boss-projectile.ogg';
import enemyDeathAudioUrl from '../assets/audio/enemy-death.ogg';
import enemyProjectileAudioUrl from '../assets/audio/enemy-projectile.ogg';
import extraLifeAudioUrl from '../assets/audio/extra-life.ogg';
import gameOverAudioUrl from '../assets/audio/game-over.ogg';
import gameStartAudioUrl from '../assets/audio/game-start.ogg';
import gameWonAudioUrl from '../assets/audio/game-won-music.ogg';
import noSpreadShotAudioUrl from '../assets/audio/no-spread-shot.ogg';
import pickupAudioUrl from '../assets/audio/pickup.ogg';
import playerDeathAudioUrl from '../assets/audio/player-death.ogg';
import playerProjectileHitAudioUrl from '../assets/audio/player-projectile-hit.ogg';
import shootAudioUrl from '../assets/audio/shoot.ogg';
import spreadShotAudioUrl from '../assets/audio/spread-shot.ogg';
import titleScreenMusicAudioUrl from '../assets/audio/title-screen-music.ogg';
import waveCompleteAudioUrl from '../assets/audio/wave-complete.ogg';
import waveSpawnAudioUrl from '../assets/audio/wave-spawn.ogg';
import { spriteFactory } from '../components/sprite.js';
import { textBlinkAnimationFactory } from '../components/text-blink-animation.js';
import { transformFactory } from '../components/transform.js';
import { tweenFactory } from '../components/tween.js';
import { Pico8Colors } from '../constants.js';
import { starfieldFactory } from '../entity-factories/star.js';
import { GameEvent } from '../game-events.js';
import { resetGameState } from '../game-state.js';
import { Scene, SceneConstructorProps } from '../scene.js';
import { eventSystemFactory } from '../systems/event-system.js';
import { movementSystemFactory } from '../systems/movement-system.js';
import { spriteAnimationSystemFactory } from '../systems/sprite-animation-system.js';
import { spriteRenderingSystemFactory } from '../systems/sprite-rendering-system.js';
import { starfieldRenderingSystemFactory } from '../systems/starfield-rendering-system.js';
import { starfieldSystemFactory } from '../systems/starfield-system.js';
import { textBlinkAnimationSystemFactory } from '../systems/text-blink-animation-system.js';
import { textRenderingSystemFactory } from '../systems/text-rendering-system.js';
import { textSystemFactory } from '../systems/text-system.js';
import { tweenSystemFactory } from '../systems/tweens-system.js';

export class LoadingScreen extends Scene {
  #areaWidth: number;
  #areaHeight: number;

  /**
   * Whether the audio manager is ready to be initialized.
   */
  #audioManagerReadyToInit = false;

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

    if (this.audioManager.isInitialized === false) {
      Promise.all([
        this.audioManager.loadTrack('big-explosion', bigExplosionAudioUrl),
        this.audioManager.loadTrack('boss-music', bossMusicAudioUrl),
        this.audioManager.loadTrack('boss-projectile', bossProjectileAudioUrl),
        this.audioManager.loadTrack('enemy-death', enemyDeathAudioUrl),
        this.audioManager.loadTrack(
          'enemy-projectile',
          enemyProjectileAudioUrl,
        ),
        this.audioManager.loadTrack('extra-life', extraLifeAudioUrl),
        this.audioManager.loadTrack('game-over', gameOverAudioUrl),
        this.audioManager.loadTrack('game-start', gameStartAudioUrl),
        this.audioManager.loadTrack('game-won', gameWonAudioUrl),
        this.audioManager.loadTrack('no-spread-shot', noSpreadShotAudioUrl),
        this.audioManager.loadTrack('shoot', shootAudioUrl),
        this.audioManager.loadTrack('spread-shot', spreadShotAudioUrl),
        this.audioManager.loadTrack('pickup', pickupAudioUrl),
        this.audioManager.loadTrack('player-death', playerDeathAudioUrl),
        this.audioManager.loadTrack(
          'player-projectile-hit',
          playerProjectileHitAudioUrl,
        ),
        this.audioManager.loadTrack(
          'title-screen-music',
          titleScreenMusicAudioUrl,
        ),
        this.audioManager.loadTrack('wave-complete', waveCompleteAudioUrl),
        this.audioManager.loadTrack('wave-spawn', waveSpawnAudioUrl),
      ]).then(() => {
        // At this point the tracks are `queued`. We cannot progress the
        // audio manager until the user has interacted with the page.
        this.#audioManagerReadyToInit = true;
      });
    }

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

    // Interact to begin text
    this.world.createEntity({
      text: {
        align: 'center',
        color: Pico8Colors.Color6,
        font: 'PICO-8',
        message: 'Interact To Begin',
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

    if (this.#audioManagerReadyToInit && this.input.any.query()) {
      // Reset the flag so we don't try to init again.
      this.#audioManagerReadyToInit = false;

      this.audioManager.init().then(() => {
        this.emit(GameEvent.StartGame);
      });
    }
  }
}
