import { Component } from '@jakeklassen/ecs';
import { Vector2d } from '../vector2d';

export class Transform extends Component {
  constructor(
    public position = new Vector2d(),
    public rotation = 0,
    public scale = new Vector2d(1, 1),
  ) {
    super();
  }
}
