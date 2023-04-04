import { AudioManager, AudioMangerEvent } from '#/lib/audio-manager.js';
import { obtainCanvasAndContext2d } from '#/lib/dom';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import '../../style.css';
import shootWavUrl from './assets/audio/shoot.wav';
import playerDeathWavUrl from './assets/audio/player-death.wav';
import playerProjectileHitWavUrl from './assets/audio/player-projectile-hit.wav';
import shmupImageUrl from './assets/image/shmup.png';
import { config } from './config.js';
import { Content } from './content.js';
import { controls } from './controls.js';
import { GameEvent } from './game-events.js';
import { gameState } from './game-state.js';
import { input } from './input.js';
import { Scene } from './scene.js';
import { GameOverScreen } from './scenes/game-over-screen.js';
import { GameplayScreen } from './scenes/gameplay-screen.js';
import { TitleScreen } from './scenes/title-screen.js';
import { SpriteSheet } from './spritesheet';

const zip = new JSZip();

const recorder = {
  frames: zip.folder('frames'),
  recording: false,
};

const audioManager = new AudioManager();

await audioManager.loadTrack('shoot', shootWavUrl);
await audioManager.loadTrack('player-death', playerDeathWavUrl);
await audioManager.loadTrack(
  'player-projectile-hit',
  playerProjectileHitWavUrl,
);

await new Promise<void>((resolve) => {
  audioManager.on(AudioMangerEvent.Ready, () => {
    console.log('audio ready - click to play');

    resolve();
  });
});

const content = await Content.load(shmupImageUrl);

const { canvas, context } = obtainCanvasAndContext2d('#canvas');

context.imageSmoothingEnabled = false;

const titleScreenScene = new TitleScreen({
  audioManager,
  canvas,
  config,
  context,
  content,
  input: controls,
  gameState,
  spriteSheet: SpriteSheet,
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
  input: controls,
  gameState,
  spriteSheet: SpriteSheet,
});
gameplayScene.on(GameEvent.GameOver, () => {
  activeScene = activeScene.switchTo(gameoverScene);
});

const gameoverScene = new GameOverScreen({
  audioManager,
  canvas,
  config,
  context,
  content,
  input: controls,
  gameState,
  spriteSheet: SpriteSheet,
});
gameoverScene.on(GameEvent.StartGame, () => {
  activeScene = activeScene.switchTo(titleScreenScene);
});

let activeScene: Scene = titleScreenScene;
activeScene.enter();

window.addEventListener('keypress', (e: KeyboardEvent) => {
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
  }
});

const TARGET_FPS = 60;
const STEP = 1000 / TARGET_FPS;
const dt = STEP / 1000;
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

  if (controls.capture.query()) {
    if (recorder.recording) {
      recorder.frames?.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `shmup-${Date.now()}.zip`);

        frameCount = 0;
      });
    }

    recorder.recording = !recorder.recording;
  }

  while (deltaTimeAccumulator >= STEP) {
    if (input.debug.query()) {
      config.debug = !config.debug;
    }

    activeScene.update(dt);

    // console.log(Math.sin(hrt / 60));

    deltaTimeAccumulator -= STEP;
  }

  if (recorder.recording) {
    recorder.frames?.file(
      `frame-${frameCount++}.png`,
      canvas.toDataURL('image/png').split(',')[1],
      { base64: true },
    );
  }

  last = hrt;

  requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);
