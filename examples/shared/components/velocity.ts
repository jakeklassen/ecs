import { Component } from '../../../src/component';

export class Velocity extends Component {
  constructor(public x = 0, public y = 0) {
    super();
  }

  public flipX() {
    this.x *= -1;
  }

  public flipY() {
    this.y *= -1;
  }
}
