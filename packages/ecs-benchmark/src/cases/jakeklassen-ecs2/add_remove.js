// @ts-check
import { World } from "@jakeklassen/ecs2";

/**
 * @param {number} count
 */
export default async (count) => {
  /**
   * @type {World<{ A?: boolean, B?: boolean }>}   */
  const ecs = new World();

  for (let i = 0; i < count; i++) {
    ecs.createEntity({
      A: true,
    });
  }

  return () => {
    for (const entity of ecs.entities) {
      ecs.addEntityComponents(entity, "B", true);
    }

    for (const entity of ecs.entities) {
      ecs.removeEntityComponents(entity, "B");
    }
  };
};
