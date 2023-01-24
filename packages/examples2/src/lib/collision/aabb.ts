import { Vector2d } from '#/shared/vector2d.js';

type AABB = {
  position: Vector2d;
  width: number;
  height: number;
};

/**
 * Return left of AABB
 */
export const aabbLeft = (aabb: AABB) => aabb.position.x;

/**
 * Return right of AABB
 */
export const aabbRight = (aabb: AABB) => aabb.position.x + aabb.width;

/**
 * Return top of AABB
 */
export const aabbTop = (aabb: AABB) => aabb.position.y;

/**
 * Return bottom of AABB
 */
export const aabbBottom = (aabb: AABB) => aabb.position.y + aabb.height;

/**
 * Axis-Aligned Bounding Box - no rotation
 * https://developer.mozilla.org/kab/docs/Games/Techniques/2D_collision_detection
 */
export const intersects = (aabb1: AABB, aabb2: AABB) =>
  aabbLeft(aabb1) < aabbRight(aabb2) &&
  aabbRight(aabb1) > aabbLeft(aabb2) &&
  aabbTop(aabb1) < aabbBottom(aabb2) &&
  aabbBottom(aabb1) > aabbTop(aabb2);
