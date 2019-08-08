import { Component } from './component';

// tslint:disable: max-classes-per-file

class Color extends Component {}
class Rectangle extends Component {}

describe('Component', () => {
  test('derived classes should have unique bitmasks', () => {
    expect(Color.bitmask.toString(2)).not.toBe(Rectangle.bitmask.toString(2));
  });
});
