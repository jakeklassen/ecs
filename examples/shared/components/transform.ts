import { Component } from '../../../src/component';
import { Vector2 } from '../vector2';

export class Transform extends Component {
  public position = Vector2.zero();

  constructor(position: Vector2 = Vector2.zero()) {
    super();

    this.position = position;
  }
}
