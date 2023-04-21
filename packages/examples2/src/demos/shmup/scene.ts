import { AudioManager } from '#/lib/audio-manager.js';
import { TextBuffer, TextBufferFont } from '#/lib/pixel-text/text-buffer.js';
import { World } from '@jakeklassen/ecs2';
import { Config } from './config.js';
import { LoadedContent } from './content.js';
import { Controls } from './controls.js';
import { Entity } from './entity.js';
import { GameEvent } from './game-events.js';
import { GameState } from './game-state.js';
import { SpriteSheet } from './spritesheet.js';
import { Timer } from './timer.js';
import { GameTime } from './game-time.js';

type System = (dt: number) => void;

export interface SceneConstructorProps {
  audioManager: AudioManager;
  canvas: HTMLCanvasElement;
  config: Config;
  content: LoadedContent;
  context: CanvasRenderingContext2D;
  fontCache: Map<string, TextBufferFont>;
  gameState: GameState;
  gameTime: GameTime;
  input: Controls;
  spriteSheet: SpriteSheet;
  timer: Timer;
  textCache: Map<Entity, TextBuffer>;
}

type SceneEventListener = () => void;

export class Scene {
  world = new World<Entity>();
  systems: System[] = [];

  protected input: Controls;
  protected content: LoadedContent;
  protected audioManager: AudioManager;
  protected config: Config;
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;
  protected fontCache: Map<string, TextBufferFont>;
  protected gameState: GameState;
  protected gameTime: GameTime;
  protected spriteSheet: SpriteSheet;
  protected timer: Timer;
  protected textCache: Map<Entity, TextBuffer>;

  private listeners = new Map<GameEvent, Array<SceneEventListener>>();

  constructor(props: SceneConstructorProps) {
    this.input = props.input;
    this.content = props.content;
    this.audioManager = props.audioManager;
    this.config = props.config;
    this.canvas = props.canvas;
    this.context = props.context;
    this.fontCache = props.fontCache;
    this.gameState = props.gameState;
    this.gameTime = props.gameTime;
    this.spriteSheet = props.spriteSheet;
    this.timer = props.timer;
    this.textCache = props.textCache;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected initialize() {}

  protected clearSystems() {
    this.systems = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public enter() {
    console.info('entering scene', this.constructor.name);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public exit() {
    console.info('exiting scene', this.constructor.name);
  }

  public switchTo(nextScene: Scene) {
    this.exit();
    nextScene.enter();

    return nextScene;
  }

  public update(delta: number) {
    for (const system of this.systems) {
      system(delta);
    }
  }

  public on(event: GameEvent, listener: SceneEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)?.push(listener);
  }

  public off(event: GameEvent, listener: SceneEventListener) {
    if (!this.listeners.has(event)) {
      return;
    }

    const listeners = this.listeners.get(event) ?? [];
    const index = listeners.indexOf(listener);

    if (index === -1) {
      return;
    }

    listeners.splice(index, 1);
  }

  public emit(event: GameEvent) {
    if (!this.listeners.has(event)) {
      return;
    }

    for (const listener of this.listeners.get(event) ?? []) {
      listener();
    }
  }
}
