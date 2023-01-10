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

class ABSystem extends System {
  /**
   *
   * @param {World} world
   */
  update(world) {
    for (const [entity, components] of world.view(A, B)) {
      let x = components.get(A).a;
      components.get(A).a = components.get(B).b;
      components.get(B).b = x;
    }
  }
}

class CDSystem extends System {
  /**
   *
   * @param {World} world
   */
  update(world) {
    for (const [entity, components] of world.view(C, D)) {
      let x = components.get(C).c;
      components.get(C).c = components.get(D).d;
      components.get(D).d = x;
    }
  }
}

class CESystem extends System {
  /**
   *
   * @param {World} world
   */
  update(world) {
    for (const [entity, components] of world.view(C, E)) {
      let x = components.get(C).c;
      components.get(C).c = components.get(E).e;
      components.get(E).e = x;
    }
  }
}

/**
 * @param {number} count
 */
export default (count) => {
  let ecs = new World();

  ecs.addSystem(new ABSystem());
  ecs.addSystem(new CDSystem());
  ecs.addSystem(new CESystem());

  for (let i = 0; i < count; i++) {
    ecs.addEntityComponents(ecs.createEntity(), new A(), new B(1));

    ecs.addEntityComponents(ecs.createEntity(), new A(), new B(1), new C(2));

    ecs.addEntityComponents(
      ecs.createEntity(),
      new A(),
      new B(1),
      new C(2),
      new D(3),
    );

    ecs.addEntityComponents(
      ecs.createEntity(),
      new A(),
      new B(1),
      new C(2),
      new D(3),
      new E(4),
    );
  }

  return () => {
    ecs.update(0);
  };
};
