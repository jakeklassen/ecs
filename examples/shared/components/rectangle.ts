import { Component } from '../../../src/component';

export class Rectangle extends Component {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number,
  ) {
    super();
  }
}
