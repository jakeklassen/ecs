import { Component } from '@jakeklassen/ecs';

export class Rectangle extends Component {
  constructor(public readonly width: number, public readonly height: number) {
    super();
  }
}
