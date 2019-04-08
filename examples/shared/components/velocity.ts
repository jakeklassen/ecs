export class Velocity {
  constructor(public x = 0, public y = 0) {}

  public flipX() {
    this.x *= -1;
  }

  public flipY() {
    this.y *= -1;
  }
}
