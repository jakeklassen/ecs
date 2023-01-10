// @ts-check
import { Component, System, World } from "@jakeklassen/ecs";

const COMPS = Array.from(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  () =>
    class extends Component {
      value = 0;

      constructor(value = 0) {
        super();

        this.value = value;
      }
    },
);

class Data extends Component {
  value = 0;

  constructor(value = 0) {
    super();

    this.value = value;
  }
}

class DataSystem extends System {
  /**
   *
   * @param {World} world
   */
  update(world) {
    for (const [entity, components] of world.view(Data)) {
      components.get(Data).value *= 2;
    }
  }
}

class ZSystem extends System {
  /**
   *
   * @param {World} world
   */
  update(world) {
    for (const [entity, components] of world.view(COMPS[25])) {
      components.get(COMPS[25]).value *= 2;
    }
  }
}

/**
 * @param {number} count
 */
export default (count) => {
  let ecs = new World();

  ecs.addSystem(new DataSystem());
  ecs.addSystem(new ZSystem());

  for (let i = 0; i < count; i++) {
    for (let Comp of COMPS) {
      ecs.addEntityComponents(ecs.createEntity(), new Comp(0), new Data(0));
    }
  }

  return () => {
    ecs.update(0);
  };
};
