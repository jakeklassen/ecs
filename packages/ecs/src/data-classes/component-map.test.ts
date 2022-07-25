import { describe, expect, it } from 'vitest';
import { ComponentMap } from './component-map.js';
import { Component } from './component.js';

class Color {
  constructor(public color = 'black') {}
}

class Position {
  constructor(public x = 0, public y = 0) {}
}

const color = new Color('red');
let _color_type: keyof Color;
const _color: Component = color;

describe('ComponentMap', () => {
  it('should support adding components', () => {
    const componentMap = new ComponentMap();
    const red = new Color('red');
    const startingPosition = new Position();

    componentMap.add(red, startingPosition);

    expect(componentMap.get(Color)).toEqual(red);
    expect(componentMap.get(Position)).toEqual(startingPosition);
  });

  it('should support removing components', () => {
    const componentMap = new ComponentMap();

    componentMap.add(new Color(), new Position());
    componentMap.delete(Color, Position);

    expect(componentMap.has(Color)).toEqual(false);
    expect(componentMap.has(Position)).toEqual(false);
  });

  it('should support checking multiple components', () => {
    const componentMap = new ComponentMap();
    const red = new Color('red');
    const startingPosition = new Position();

    componentMap.add(red, startingPosition);

    expect(componentMap.has(Color, Position)).toEqual(true);
  });
});
