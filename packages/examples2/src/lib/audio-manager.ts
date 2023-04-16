import { EventEmitter } from './event-emitter.js';

type AudioManagerEventListener = () => void;

export enum AudioMangerEvent {
  Loaded = 'Loaded',
  Ready = 'Ready',
}

type AudioManagerEvents = {
  [AudioMangerEvent.Loaded]: AudioManagerEventListener;
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
  #muted = false;

  public get muted() {
    return this.#muted;
  }

  public get isInitialized() {
    return this.#audioContext != null;
  }

  public async init() {
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
  }

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

  public mute() {
    if (this.#audioContext == null || this.#gainNode == null) {
      return;
    }

    this.#gainNode.gain.value = 0;
    this.#muted = true;
  }

  public unmute() {
    if (this.#audioContext == null || this.#gainNode == null) {
      return;
    }

    this.#gainNode.gain.value = 1;
    this.#muted = false;
  }

  public play(track: string, options: PlayOptions) {
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

    if (!this.muted) {
      this.#gainNode.gain.value =
        options.volume ?? defaultPlaybackOptions.volume;
    }

    source.loop = options.loop ?? defaultPlaybackOptions.loop;

    // TODO: https://stackoverflow.com/questions/47996114/webaudio-play-sound-pops-at-start-and-end
    // Maybe helps with pop. I don't think it will cause I don't control the
    // end of the sound with something like a button click. So the pop will
    // happen, then this handler will be called.
    //
    // If I can get the track length, I can use that to calculate the time
    // to stop the sound?
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
