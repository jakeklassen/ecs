import { Vector2 } from '../vector2';

export class Transform {
  public position = Vector2.zero();

  constructor(position: Vector2 = Vector2.zero()) {
    this.position = position;
  }
}
