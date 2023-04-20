export class GameTime {
  #frame = 0;
  #hrt: DOMHighResTimeStamp = 0;
  #last = performance.now();
  #seconds = 0;
  #time = performance.now();

  update(hrt: DOMHighResTimeStamp) {
    const deltaTime = (hrt - this.#last) / 1000;

    this.#frame++;
    this.#hrt = hrt;
    this.#seconds = Math.floor(hrt / 1000);
    this.#time += deltaTime;

    this.#last = hrt;
  }

  public get frame() {
    return this.#frame;
  }

  public get hrt() {
    return this.#hrt;
  }

  public get seconds() {
    return this.#seconds;
  }

  public get time() {
    return this.#time;
  }
}

export const gameTime = new GameTime();

// @ts-ignore
window.gameTime = gameTime;
