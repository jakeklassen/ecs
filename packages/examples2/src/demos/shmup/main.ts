import { AudioManager, AudioMangerEvent } from '#/lib/audio-manager.js';
import { obtainCanvasAndContext2d } from '#/lib/dom';
import { loadFont } from '#/lib/pixel-text/load-font.js';
import { TextBuffer, TextBufferFont } from '#/lib/pixel-text/text-buffer.js';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import '../../style.css';
import bigExplosionAudioUrl from './assets/audio/big-explosion.ogg';
import bossMusicAudioUrl from './assets/audio/boss-music.ogg';
import bossProjectileAudioUrl from './assets/audio/boss-projectile.ogg';
import enemyDeathAudioUrl from './assets/audio/enemy-death.ogg';
import enemyProjectileAudioUrl from './assets/audio/enemy-projectile.ogg';
import extraLifeAudioUrl from './assets/audio/extra-life.ogg';
import gameOverAudioUrl from './assets/audio/game-over.ogg';
import gameStartAudioUrl from './assets/audio/game-start.ogg';
import gameWonAudioUrl from './assets/audio/game-won-music.ogg';
import noSpreadShotAudioUrl from './assets/audio/no-spread-shot.ogg';
import pickupAudioUrl from './assets/audio/pickup.ogg';
import playerDeathAudioUrl from './assets/audio/player-death.ogg';
import playerProjectileHitAudioUrl from './assets/audio/player-projectile-hit.ogg';
import shootAudioUrl from './assets/audio/shoot.ogg';
import spreadShotAudioUrl from './assets/audio/spread-shot.ogg';
import titleScreenMusicAudioUrl from './assets/audio/title-screen-music.ogg';
import waveCompleteAudioUrl from './assets/audio/wave-complete.ogg';
import waveSpawnAudioUrl from './assets/audio/wave-spawn.ogg';
import pico8FontImageUrl from './assets/font/pico-8_regular_5.png';
import pico8FontXmlUrl from './assets/font/pico-8_regular_5.xml?url';
import explosionsSheetImageUrl from './assets/image/explosions.png';
import playerExplosionsSheetImageUrl from './assets/image/player-explosions.png';
import spriteSheetImageUrl from './assets/image/shmup.png';
import { config } from './config.js';
import { Content } from './content.js';
import { controls } from './controls.js';
import { Entity } from './entity.js';
import { GameEvent } from './game-events.js';
import { gameState } from './game-state.js';
import { gameTime } from './game-time.js';
import { input } from './input.js';
import { Scene } from './scene.js';
import { GameOverScreen } from './scenes/game-over-screen.js';
import { GameWonScreen } from './scenes/game-won-screen.js';
import { GameplayScreen } from './scenes/gameplay-screen.js';
import { LoadingScreen } from './scenes/loading-screen.js';
import { TitleScreen } from './scenes/title-screen.js';
import { SpriteSheet } from './spritesheet';
import { Timer } from './timer.js';

const zip = new JSZip();

const recorder = {
  frames: zip.folder('frames'),
  recording: false,
};

const audioManager = new AudioManager();

audioManager.loadTrack('big-explosion', bigExplosionAudioUrl);
audioManager.loadTrack('boss-music', bossMusicAudioUrl);
audioManager.loadTrack('boss-projectile', bossProjectileAudioUrl);
audioManager.loadTrack('enemy-death', enemyDeathAudioUrl);
audioManager.loadTrack('enemy-projectile', enemyProjectileAudioUrl);
audioManager.loadTrack('extra-life', extraLifeAudioUrl);
audioManager.loadTrack('game-over', gameOverAudioUrl);
audioManager.loadTrack('game-start', gameStartAudioUrl);
audioManager.loadTrack('game-won', gameWonAudioUrl);
audioManager.loadTrack('no-spread-shot', noSpreadShotAudioUrl);
audioManager.loadTrack('shoot', shootAudioUrl);
audioManager.loadTrack('spread-shot', spreadShotAudioUrl);
audioManager.loadTrack('pickup', pickupAudioUrl);
audioManager.loadTrack('player-death', playerDeathAudioUrl);
audioManager.loadTrack('player-projectile-hit', playerProjectileHitAudioUrl);
audioManager.loadTrack('title-screen-music', titleScreenMusicAudioUrl);
audioManager.loadTrack('wave-complete', waveCompleteAudioUrl);
audioManager.loadTrack('wave-spawn', waveSpawnAudioUrl);

audioManager.on(AudioMangerEvent.Ready, () => {
  console.log('🎵 audio ready');

  activeScene?.emit(GameEvent.StartGame);
});

const picoFont = await loadFont(pico8FontImageUrl, pico8FontXmlUrl);

const fontCache = new Map<string, TextBufferFont>();
fontCache.set(picoFont.family, picoFont);

const textCache = new Map<Entity, TextBuffer>();

const content = await Content.load({
  explosionsSheetImageUrl,
  playerExplosionsSheetImageUrl,
  spriteSheetImageUrl,
});

const timer = new Timer();

const { canvas, context } = obtainCanvasAndContext2d('#canvas');

context.imageSmoothingEnabled = false;

const loadingScreenScene = new LoadingScreen({
  audioManager,
  canvas,
  config,
  context,
  content,
  fontCache,
  input: controls,
  gameState,
  gameTime,
  spriteSheet: SpriteSheet,
  timer,
  textCache,
});
loadingScreenScene.on(GameEvent.StartGame, () => {
  activeScene = activeScene.switchTo(titleScreenScene);
});

const titleScreenScene = new TitleScreen({
  audioManager,
  canvas,
  config,
  context,
  content,
  fontCache,
  input: controls,
  gameState,
  gameTime,
  spriteSheet: SpriteSheet,
  timer,
  textCache,
});
titleScreenScene.on(GameEvent.StartGame, () => {
  activeScene = activeScene.switchTo(gameplayScene);
});

const gameplayScene = new GameplayScreen({
  audioManager,
  canvas,
  config,
  context,
  content,
  fontCache,
  input: controls,
  gameState,
  gameTime,
  spriteSheet: SpriteSheet,
  timer,
  textCache,
});
gameplayScene.on(GameEvent.GameOver, () => {
  activeScene = activeScene.switchTo(gameoverScene);
});
gameplayScene.on(GameEvent.GameWon, () => {
  activeScene = activeScene.switchTo(gameWonScene);
});

const gameoverScene = new GameOverScreen({
  audioManager,
  canvas,
  config,
  context,
  content,
  fontCache,
  input: controls,
  gameState,
  gameTime,
  spriteSheet: SpriteSheet,
  timer,
  textCache,
});
gameoverScene.on(GameEvent.StartGame, () => {
  activeScene = activeScene.switchTo(titleScreenScene);
});

const gameWonScene = new GameWonScreen({
  audioManager,
  canvas,
  config,
  context,
  content,
  fontCache,
  input: controls,
  gameState,
  gameTime,
  spriteSheet: SpriteSheet,
  timer,
  textCache,
});
gameWonScene.on(GameEvent.StartGame, () => {
  activeScene = activeScene.switchTo(titleScreenScene);
});

let activeScene: Scene = loadingScreenScene;
activeScene.enter();

window.addEventListener('click', async () => {
  if (!audioManager.isInitialized) {
    await audioManager.init();
  }
});

window.addEventListener('keypress', async (e: KeyboardEvent) => {
  if (!audioManager.isInitialized) {
    await audioManager.init();
  }

  if (e.key === 'r') {
    if (recorder.recording) {
      recorder.frames?.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `shmup-${Date.now()}.zip`);

        frameCount = 0;
      });
    }

    recorder.recording = !recorder.recording;

    document
      .querySelector<HTMLSpanElement>('#recording-on')
      ?.classList.toggle('hidden');

    document
      .querySelector<HTMLSpanElement>('#recording-off')
      ?.classList.toggle('hidden');
  } else if (e.key === 'm') {
    if (audioManager.muted) {
      audioManager.unmute();
    } else {
      audioManager.mute();
    }

    document
      .querySelector<HTMLSpanElement>('#sound-on')
      ?.classList.toggle('hidden');

    document
      .querySelector<HTMLSpanElement>('#sound-off')
      ?.classList.toggle('hidden');
  }
});

const TARGET_FPS = 60;
const STEP = 1000 / TARGET_FPS;
const dt = STEP / 1000;
// @ts-ignore
let variableDt = 0;
let last = performance.now();
let deltaTimeAccumulator = 0;

let frameCount = 0;

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
  deltaTimeAccumulator += Math.min(1000, hrt - last);
  variableDt = (hrt - last) / 1000;
  gameTime.update(hrt);

  while (deltaTimeAccumulator >= STEP) {
    if (input.debug.query()) {
      config.debug = !config.debug;
    }

    activeScene.update(dt);

    if (recorder.recording) {
      recorder.frames?.file(
        `frame-${frameCount++}.png`,
        canvas.toDataURL('image/png').split(',')[1],
        { base64: true },
      );
    }

    deltaTimeAccumulator -= STEP;
  }

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
