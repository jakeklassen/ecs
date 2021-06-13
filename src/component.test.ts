import { Component } from './component.js';

// tslint:disable: max-classes-per-file

class Color extends Component {}
class Rectangle extends Component {}

describe('Component', () => {
  test('derived classes should have unique bitmasks', () => {
    expect(Color.bitmask.isEqual(Rectangle.bitmask)).toBe(false);
  });
});
