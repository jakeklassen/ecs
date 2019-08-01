import { Component } from '../../src/component';

export class Vector2 extends Component {
  public static zero() {
    return new Vector2(0, 0);
  }

  public x = 0;
  public y = 0;

  constructor(x = 0, y = 0) {
    super();

    this.x = x;
    this.y = y;
  }
}
