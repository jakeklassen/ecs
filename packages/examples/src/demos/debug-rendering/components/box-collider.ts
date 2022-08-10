import { Component } from '@jakeklassen/ecs';

export class BoxCollider extends Component {
  constructor(
    public offsetX: number,
    public offsetY: number,
    public width: number,
    public height: number,
  ) {
    super();
  }
}
