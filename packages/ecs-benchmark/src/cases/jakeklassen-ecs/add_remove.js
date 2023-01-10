// @ts-check
import { Component, World } from "@jakeklassen/ecs";

class A extends Component {
  a = true;

  constructor(a = true) {
    super();

    this.a = a;
  }
}

class B extends Component {
  b = true;

  constructor(b = true) {
    super();

    this.b = b;
  }
}

/**
 * @param {number} count
 */
export default async (count) => {
  const ecs = new World();

  for (let i = 0; i < count; i++) {
    ecs.addEntityComponents(ecs.createEntity(), new A());
  }

  return () => {
    for (const [entity] of ecs.entities) {
      ecs.addEntityComponents(entity, new B());
    }

    for (const [entity] of ecs.entities) {
      ecs.removeEntityComponents(entity, B);
    }
  };
};
