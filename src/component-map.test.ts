import { ComponentMap } from './component-map.js';
import { Component } from './component.js';

// tslint:disable: max-classes-per-file

class Color extends Component {}
class Rectangle extends Component {}

describe('ComponentMap', () => {
  it('should update bitmask when adding components', () => {
    const cm = new ComponentMap();
    cm.set(new Color());

    expect(cm.bitmask.and(Color.bitmask).isEqual(Color.bitmask)).toBe(true);
    expect(cm.bitmask.and(Rectangle.bitmask).isEqual(Rectangle.bitmask)).toBe(
      false,
    );

    cm.set(new Rectangle());

    expect(
      Color.bitmask.or(Rectangle.bitmask).and(cm.bitmask).isEqual(cm.bitmask),
    ).toBe(true);
  });

  it('should update bitmask when removing components', () => {
    const cm = new ComponentMap();
    cm.set(new Color());
    cm.set(new Rectangle());
    cm.remove(Rectangle);

    expect(cm.bitmask.and(Color.bitmask).isEqual(Color.bitmask)).toBe(true);
    expect(cm.bitmask.and(Rectangle.bitmask).isEqual(Rectangle.bitmask)).toBe(
      false,
    );
  });

  it('should support clearing components', () => {
    const cm = new ComponentMap();
    cm.set(new Color());

    cm.clear();

    expect(cm.bitmask.isEmpty()).toBe(true);
    expect(cm.get(Color)).toBeUndefined();
  });
});
