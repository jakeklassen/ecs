import { Frame } from '../structures/frame';
import { Component } from '@jakeklassen/ecs';

export class Sprite extends Component {
  constructor(public frame: Frame, public opacity = 1) {
    super();
  }
}
