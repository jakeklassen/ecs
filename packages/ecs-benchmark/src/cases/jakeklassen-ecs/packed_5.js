// @ts-check
import { Component, System, World } from "@jakeklassen/ecs";

class A extends Component {
  a = 0;

  constructor(a = 0) {
    super();

    this.a = a;
  }
}

class B extends Component {
  b = 0;

  constructor(b = 0) {
    super();

    this.b = b;
  }
}

class C extends Component {
  c = 0;

  constructor(c = 0) {
    super();

    this.c = c;
  }
}

class D extends Component {
  d = 0;

  constructor(d = 0) {
    super();

    this.d = d;
  }
}

class E extends Component {
  e = 0;

  constructor(e = 0) {
    super();

    this.e = e;
  }
}

class ASystem extends System {
  /**
   *
   * @param {World} world
   */
  update(world) {
    for (const [entity, components] of world.view(A)) {
      components.get(A).a *= 2;
    }
  }
}

class BSystem extends System {
  /**
   *
   * @param {World} world
   */
  update(world) {
    for (const [entity, components] of world.view(B)) {
      components.get(B).b *= 2;
    }
  }
}

class CSystem extends System {
  /**
   *
   * @param {World} world
   */
  update(world) {
    for (const [entity, components] of world.view(C)) {
      components.get(C).c *= 2;
    }
  }
}

class DSystem extends System {
  /**
   *
   * @param {World} world
   */
  update(world) {
    for (const [entity, components] of world.view(D)) {
      components.get(D).d *= 2;
    }
  }
}

class ESystem extends System {
  /**
   *
   * @param {World} world
   */
  update(world) {
    for (const [entity, components] of world.view(E)) {
      components.get(E).e *= 2;
    }
  }
}

/**
 * @param {number} count
 */
export default (count) => {
  let ecs = new World();

  ecs.addSystem(new ASystem());
  ecs.addSystem(new BSystem());
  ecs.addSystem(new CSystem());
  ecs.addSystem(new DSystem());
  ecs.addSystem(new ESystem());

  for (let i = 0; i < count; i++) {
    ecs.addEntityComponents(
      ecs.createEntity(),
      new A(),
      new B(),
      new C(),
      new D(),
      new E(),
    );
  }

  return () => {
    ecs.update(0);
  };
};
