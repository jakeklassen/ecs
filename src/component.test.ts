import { Component } from './component';

// tslint:disable: max-classes-per-file

class Color extends Component {}
class Rectangle extends Component {}

describe('Component', () => {
  test('derived classes should have unique bitmasks', () => {
    expect(Color.bitmask.equals(Rectangle.bitmask)).toBe(false);
  });
});
