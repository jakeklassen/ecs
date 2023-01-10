// @ts-check
import { World } from "@jakeklassen/ecs2";

/**
 * @param {number} count
 */
export default (count) => {
  /**
   * @type {World<{ A?: number, B?: number }>}
   */
  const ecs = new World();

  for (let i = 0; i < count; i++) {
    ecs.createEntity({ A: 1 });
  }

  const withA = ecs.archetype("A");
  const withB = ecs.archetype("B");

  return () => {
    for (const _entity of withA.entities) {
      ecs.createEntity({ B: 1 });
    }

    for (const entity of withB.entities) {
      ecs.deleteEntity(entity);
    }
  };
};
