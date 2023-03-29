import { AudioManager } from '#/lib/audio-manager.js';
import { World } from '@jakeklassen/ecs2';
import { Control } from 'contro/dist/core/control.js';
import { Config } from './config.js';
import { LoadedContent } from './content.js';
import { GameEvent } from './game-events.js';
import { GameState } from './game-state.js';

type Controls = Record<string, Control<any>>;

type GameLoop = (dt: number) => void;

interface SceneConstructorProps {
  audioManager: AudioManager;
  canvas: HTMLCanvasElement;
  config: Config;
  content: LoadedContent;
  context: CanvasRenderingContext2D;
  gameLoop: GameLoop;
  gameState: GameState;
  input: Controls;
}

type SceneEventListener = () => void;

export class Scene {
  world = new World();

  protected input: Controls;
  protected content: LoadedContent;
  protected audioManager: AudioManager;
  protected config: Config;
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;
  protected gameState: GameState;
  protected gameLoop: GameLoop;

  private listeners = new Map<GameEvent, Array<SceneEventListener>>();

  constructor(props: SceneConstructorProps) {
    this.input = props.input;
    this.content = props.content;
    this.audioManager = props.audioManager;
    this.config = props.config;
    this.canvas = props.canvas;
    this.context = props.context;
    this.gameState = props.gameState;
    this.gameLoop = props.gameLoop;

    this.initialize();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected initialize() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public enter() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public exit() {}

  public switchTo(nextScene: Scene) {
    this.exit();
    nextScene.enter();

    return nextScene;
  }

  public update(delta: number) {
    this.gameLoop(delta);
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
