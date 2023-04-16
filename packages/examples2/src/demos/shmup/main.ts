import { AudioManager, AudioMangerEvent } from '#/lib/audio-manager.js';
import { obtainCanvasAndContext2d } from '#/lib/dom';
import { TextBuffer, TextBufferFont } from '#/lib/pixel-text/text-buffer.js';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import '../../style.css';
import bossMusicWavUrl from './assets/audio/boss-music.mp3';
import enemyDeathWaveUrl from './assets/audio/enemy-death.wav';
import gameOverWavUrl from './assets/audio/game-over.wav';
import gameStartWavUrl from './assets/audio/game-start.wav';
import gameWonWavUrl from './assets/audio/game-won-music.wav';
import playerDeathWavUrl from './assets/audio/player-death.wav';
import playerProjectileHitWavUrl from './assets/audio/player-projectile-hit.wav';
import shootWavUrl from './assets/audio/shoot.wav';
import titleScreenMusicWavUrl from './assets/audio/title-screen-music.mp3';
import waveSpawnWavUrl from './assets/audio/wave-spawn.wav';
import waveCompleteWavUrl from './assets/audio/wave-complete.wav';
import shmupImageUrl from './assets/image/shmup.png';
import pico8FontImageUrl from './assets/font/pico-8_regular_5.png';
import pico8FontXmlUrl from './assets/font/pico-8_regular_5.xml?url';
import { config } from './config.js';
import { Content } from './content.js';
import { controls } from './controls.js';
import { Entity } from './entity.js';
import { GameEvent } from './game-events.js';
import { gameState } from './game-state.js';
import { input } from './input.js';
import { Scene } from './scene.js';
import { GameOverScreen } from './scenes/game-over-screen.js';
import { GameplayScreen } from './scenes/gameplay-screen.js';
import { LoadingScreen } from './scenes/loading-screen.js';
import { TitleScreen } from './scenes/title-screen.js';
import { SpriteSheet } from './spritesheet';
import { loadFont } from '#/lib/pixel-text/load-font.js';
import { Timer } from './timer.js';
import { GameWonScreen } from './scenes/game-won-screen.js';

const zip = new JSZip();

const recorder = {
  frames: zip.folder('frames'),
  recording: false,
};

const audioManager = new AudioManager();

await audioManager.loadTrack('boss-music', bossMusicWavUrl);
await audioManager.loadTrack('enemy-death', enemyDeathWaveUrl);
await audioManager.loadTrack('game-over', gameOverWavUrl);
await audioManager.loadTrack('game-start', gameStartWavUrl);
await audioManager.loadTrack('game-won', gameWonWavUrl);
await audioManager.loadTrack('shoot', shootWavUrl);
await audioManager.loadTrack('player-death', playerDeathWavUrl);
await audioManager.loadTrack(
  'player-projectile-hit',
  playerProjectileHitWavUrl,
);
await audioManager.loadTrack('title-screen-music', titleScreenMusicWavUrl);
await audioManager.loadTrack('wave-complete', waveCompleteWavUrl);
await audioManager.loadTrack('wave-spawn', waveSpawnWavUrl);

audioManager.on(AudioMangerEvent.Ready, () => {
  console.log('audio ready');

  activeScene?.emit(GameEvent.StartGame);
});

const picoFont = await loadFont(pico8FontImageUrl, pico8FontXmlUrl);

const fontCache = new Map<string, TextBufferFont>();
fontCache.set(picoFont.family, picoFont);

const textCache = new Map<Entity, TextBuffer>();

const content = await Content.load(shmupImageUrl);

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
