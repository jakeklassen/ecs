import 'jest';
import { Component } from './component';
import { World } from './world';

class Color extends Component {
  constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number,
    public readonly a: number,
  ) {
    super();
  }
}

describe('World', () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  it('will create a new entity', () => {
    expect(world.createEntity().id).toBeDefined();
  });

  it('`addEntityComponent` should return `World` instance for chaining', () => {
    const entity = world.createEntity();
    expect(
      world.addEntityComponent(entity, new Color(255, 255, 255, 1)),
    ).toBeInstanceOf(World);
  });
});
