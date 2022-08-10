import { Component } from '@jakeklassen/ecs';

export class Direction extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}
