// @ts-check
import { World } from "@jakeklassen/ecs2";

/**
 * @typedef {World<{ A?: number, B?: number, C?: number, D?: number, E?: number }>} DemoWorld
 */

/**
 * @param {number} count
 */
export default (count) => {
  /**
   * @type {DemoWorld}
   */
  const ecs = new World();

  for (let i = 0; i < count; i++) {
    ecs.createEntity({ A: 1, B: 1 });
  }

  for (let i = 0; i < count; i++) {
    ecs.createEntity({ A: 1, B: 1, C: 1 });
  }

  for (let i = 0; i < count; i++) {
    ecs.createEntity({ A: 1, B: 1, C: 1, D: 1 });
  }

  for (let i = 0; i < count; i++) {
    ecs.createEntity({ A: 1, B: 1, C: 1, E: 1 });
  }

  const withAB = ecs.archetype("A", "B");
  const withCD = ecs.archetype("C", "D");
  const withCE = ecs.archetype("C", "E");

  return () => {
    for (const entity of withAB.entities) {
      const temp = entity.A;
      entity.A = entity.B;
      entity.B = temp;
    }

    for (const entity of withCD.entities) {
      const temp = entity.C;
      entity.C = entity.D;
      entity.D = temp;
    }

    for (const entity of withCE.entities) {
      const temp = entity.C;
      entity.C = entity.E;
      entity.E = temp;
    }
  };
};
