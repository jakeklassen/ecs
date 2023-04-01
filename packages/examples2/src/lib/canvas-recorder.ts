interface CanvasRecorderOptions {
  canvases: HTMLCanvasElement[];
  width: number;
  height: number;
  download?: boolean;
  filename?: string;
  frameRate?: number;
  showInstructions?: boolean;
}

const instructions = `Press "r" to start recording, "r" again to stop recording.

Currently the webm export will not play directly in all media players.

I use \`ffmpeg -i "sand.webm" -vf scale=1024:576:flags=neighbor -r 60 sand-output.webm\` to convert before sharing.
`;

export class CanvasRecorder {
  #recorder: MediaRecorder | null = null;
  #recording = false;
  #canvases: HTMLCanvasElement[] = [];
  #streams: MediaStream[] = [];
  #stream: MediaStream | null = null;
  #chunks: Blob[] = [];
  #width: number;
  #height: number;
  #buffer = document.createElement('canvas');
  #context = this.#buffer.getContext('2d', {
    alpha: false,
  })!;

  constructor(options: CanvasRecorderOptions) {
    if (options.showInstructions ?? true) {
      console.info(instructions);
    }

    console.log(options);

    this.#width = options.width ?? 256;
    this.#height = options.height ?? 144;

    this.#buffer.width = this.#width;
    this.#buffer.height = this.#height;
    this.#buffer.style.width = `${this.#width}px`;
    this.#buffer.style.height = `${this.#height}px`;
    this.#context.imageSmoothingEnabled = false;
    this.#context.clearRect(0, 0, this.#width, this.#height);

    const mediaStreamOptions: MediaRecorderOptions = {
      // mimeType: 'video/x-matroska;codecs=avc1',
      mimeType: 'video/webm',
      audioBitsPerSecond: 128000, // 128 Kbit/sec
      videoBitsPerSecond: 2500000, // 2.5 Mbit/sec
    };

    this.#canvases = options.canvases;
    for (const canvas of options.canvases) {
      this.#streams.push(canvas.captureStream(options.frameRate));
    }

    this.#stream = this.#buffer.captureStream(options.frameRate);

    if (this.#stream == null) {
      throw new Error('no canvases to record');
    }

    this.#recorder = new MediaRecorder(this.#stream, mediaStreamOptions);

    this.#recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.#chunks.push(event.data);
      }
    };

    this.#recorder.onstop = () => {
      const link = document.createElement('a');

      if (options.download && this.#chunks.length > 0) {
        const blob = new Blob(this.#chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        link.download = options.filename ?? 'recording.webm';
        link.href = url;

        const event = new MouseEvent('click');
        link.dispatchEvent(event);

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1);
      }
    };
  }

  get recording() {
    return this.#recording;
  }

  start(timeslice?: number) {
    if (this.#recording) {
      return;
    }

    this.#recording = true;
    this.#chunks = [];
    this.#recorder?.start(timeslice);
  }

  frame() {
    if (!this.#recording) {
      return;
    }

    for (const canvas of this.#canvases) {
      this.#context.clearRect(0, 0, this.#width, this.#height);
      this.#context.drawImage(canvas, 0, 0);
    }
  }

  step() {}

  stop() {
    if (!this.#recording) {
      return;
    }

    this.#recording = false;
    this.#recorder?.stop();

    return this.#chunks;
  }
}
