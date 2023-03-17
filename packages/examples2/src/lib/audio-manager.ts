import { EventEmitter } from './event-emitter.js';

type AudioManagerEventListener = () => void;

export enum AudioMangerEvent {
  Ready = 'Ready',
}

type AudioManagerEvents = {
  [AudioMangerEvent.Ready]: AudioManagerEventListener;
};

type PlayOptions = {
  volume?: number;
  loop?: boolean;
};

const defaultPlaybackOptions: Required<PlayOptions> = {
  volume: 1,
  loop: false,
};

export class AudioManager {
  #audioContext: AudioContext | undefined;
  #gainNode: GainNode | undefined;
  #preloaded = new Map<string, ArrayBuffer>();
  #tracks = new Map<string, AudioBuffer>();
  #playing = new Map<string, AudioBufferSourceNode>();
  #emitter = new EventEmitter<AudioManagerEvents>();

  constructor() {
    window.addEventListener('click', this.#windowClickListener);
    window.addEventListener('keypress', this.#windowClickListener);
  }

  #windowClickListener = async () => {
    if (this.#audioContext == null) {
      this.#audioContext = new AudioContext();
      this.#gainNode = this.#audioContext.createGain();
      this.#gainNode.connect(this.#audioContext.destination);
    }

    if (!this.#audioContext.state) {
      this.#audioContext.resume();
    }

    for (const [trackName, buffer] of this.#preloaded.entries()) {
      await this.loadTrackFromBuffer(trackName, buffer);
    }

    this.#preloaded.clear();

    this.emit(AudioMangerEvent.Ready);

    window.removeEventListener('click', this.#windowClickListener);
    window.removeEventListener('keypress', this.#windowClickListener);
  };

  public on(event: AudioMangerEvent, listener: AudioManagerEventListener) {
    if (!this.#emitter.has(event)) {
      this.#emitter.set(event, []);
    }

    this.#emitter.get(event)?.push(listener);
  }

  public off(event: AudioMangerEvent, listener: AudioManagerEventListener) {
    if (!this.#emitter.has(event)) {
      return;
    }

    const listeners = this.#emitter.get(event) ?? [];
    const index = listeners.indexOf(listener);

    if (index === -1) {
      return;
    }

    listeners.splice(index, 1);
  }

  public emit(event: AudioMangerEvent) {
    if (!this.#emitter.has(event)) {
      return;
    }

    for (const listener of this.#emitter.get(event) ?? []) {
      listener();
    }
  }

  public async loadTrackFromBuffer(name: string, buffer: ArrayBuffer) {
    if (this.#audioContext == null) {
      this.#preloaded.set(name, buffer);

      return;
    }

    const audioBuffer = await this.#audioContext.decodeAudioData(buffer);
    this.#tracks.set(name, audioBuffer);
  }

  public async loadTrack(name: string, url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    // if the context is not yet available, store the track for later
    if (this.#audioContext == null) {
      this.#preloaded.set(name, arrayBuffer);

      return;
    }

    const audioBuffer = await this.#audioContext.decodeAudioData(arrayBuffer);
    this.#tracks.set(name, audioBuffer);
  }

  public async play(track: string, options: PlayOptions) {
    if (this.#audioContext == null) {
      console.warn('AudioManager is disabled');

      return;
    }

    if (this.#gainNode == null) {
      console.warn('AudioManager is disabled');

      return;
    }

    if (options.loop === true && this.#playing.has(track)) {
      console.warn(`Track "${track}" is already playing`);

      return;
    }

    const audioBuffer = this.#tracks.get(track);
    if (!audioBuffer) {
      throw new Error(`Track ${track} not found`);
    }

    const source = this.#audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.#gainNode);
    this.#gainNode.gain.value = options.volume ?? defaultPlaybackOptions.volume;
    source.loop = options.loop ?? defaultPlaybackOptions.loop;
    source.onended = () => {
      if (options.loop === false) {
        this.#playing.delete(track);
      }
    };
    source.start();

    this.#playing.set(track, source);
  }

  public stop(track: string) {
    if (!this.#playing.has(track)) {
      return;
    }

    this.#playing.get(track)?.stop();
    this.#playing.delete(track);
  }

  public stopAll() {
    for (const [_trackName, source] of this.#playing.entries()) {
      source.stop();
    }

    this.#playing.clear();
  }
}
