import { Component } from './component';
import { ComponentMap } from './component-map';

// tslint:disable: max-classes-per-file

class Color extends Component {}
class Rectangle extends Component {}

describe('ComponentMap', () => {
  it('should maintain bitmask when adding components', () => {
    const cm = new ComponentMap();
    cm.set(new Color());

    expect(cm.bitmask.and(Color.bitmask).isEmpty()).toBe(false);
    expect(cm.bitmask.and(Rectangle.bitmask).isEmpty()).toBe(true);

    cm.set(new Rectangle());

    expect(
      Color.bitmask
        .or(Rectangle.bitmask)
        .and(cm.bitmask)
        .isEmpty(),
    ).toBe(false);
  });

  it('should maintain bitmask when removing components', () => {
    const cm = new ComponentMap();
    cm.set(new Color());
    cm.set(new Rectangle());
    cm.remove(Rectangle);

    expect(cm.bitmask.and(Color.bitmask).isEmpty()).toBe(false);
    expect(cm.bitmask.and(Rectangle.bitmask).isEmpty()).toBe(true);
  });
});
