export class Time {
  #hrt: DOMHighResTimeStamp = 0;
  #seconds = 0;

  update(hrt: DOMHighResTimeStamp) {
    this.#hrt = hrt;
    this.#seconds = Math.floor(hrt / 1000);
  }

  public get hrt() {
    return this.#hrt;
  }

  public get seconds() {
    return this.#seconds;
  }
}
