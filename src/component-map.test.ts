import { Component } from './component';
import { ComponentMap } from './component-map';

// tslint:disable: max-classes-per-file

class Color extends Component {}
class Rectangle extends Component {}

describe('ComponentMap', () => {
  it('should update bitmask when adding components', () => {
    const cm = new ComponentMap();
    cm.set(new Color());

    expect(cm.bitmask.and(Color.bitmask).equals(Color.bitmask)).toBe(true);
    expect(cm.bitmask.and(Rectangle.bitmask).equals(Rectangle.bitmask)).toBe(
      false,
    );

    cm.set(new Rectangle());

    expect(
      Color.bitmask
        .or(Rectangle.bitmask)
        .and(cm.bitmask)
        .equals(cm.bitmask),
    ).toBe(true);
  });

  it('should update bitmask when removing components', () => {
    const cm = new ComponentMap();
    cm.set(new Color());
    cm.set(new Rectangle());
    cm.remove(Rectangle);

    expect(cm.bitmask.and(Color.bitmask).equals(Color.bitmask)).toBe(true);
    expect(cm.bitmask.and(Rectangle.bitmask).equals(Rectangle.bitmask)).toBe(
      false,
    );
  });
});
