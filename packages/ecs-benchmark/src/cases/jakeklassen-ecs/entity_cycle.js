// @ts-check

import { Component, World } from "@jakeklassen/ecs";

class A extends Component {
  a = 1;

  constructor(a = 1) {
    super();

    this.a = a;
  }
}

class B extends Component {
  b = 1;

  constructor(b = 1) {
    super();

    this.b = b;
  }
}

/**
 * @param {number} count
 */
export default (count) => {
  const ecs = new World();

  for (let i = 0; i < count; i++) {
    ecs.addEntityComponents(ecs.createEntity(), new A());
  }

  const withA = ecs.view(A);
  const withB = ecs.view(B);

  return () => {
    for (const [] of withA) {
      ecs.addEntityComponents(ecs.createEntity(), new B());
    }

    for (const [entity] of withB) {
      ecs.deleteEntity(entity);
    }
  };
};
