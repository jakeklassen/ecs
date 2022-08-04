import { Component } from '@jakeklassen/ecs';

export class Color extends Component {
  constructor(public color: string) {
    super();
  }
}
