import { World } from '@jakeklassen/ecs2';
import { CollisionMasks } from '../bitmasks.js';
import { transformFactory } from '../components/transform.js';
import { Entity } from '../entity.js';
import { SpriteSheet } from '../spritesheet.js';

export function cherryFactory({
  transform,
  world,
}: {
  transform: NonNullable<Entity['transform']>;
  world: World<Entity>;
}) {
  return world.createEntity({
    boxCollider: {
      offsetX: SpriteSheet.cherry.boxCollider.offsetX,
      offsetY: SpriteSheet.cherry.boxCollider.offsetY,
      width: SpriteSheet.cherry.boxCollider.width,
      height: SpriteSheet.cherry.boxCollider.height,
    },
    collisionLayer: CollisionMasks.Pickup,
    collisionMask: CollisionMasks.Player,
    direction: {
      x: 0,
      y: 1,
    },
    tagPickup: true,
    transform: transformFactory({
      position: transform.position,
    }),
    sprite: {
      frame: {
        sourceX: SpriteSheet.cherry.frame.sourceX,
        sourceY: SpriteSheet.cherry.frame.sourceY,
        width: SpriteSheet.cherry.frame.width,
        height: SpriteSheet.cherry.frame.height,
      },
      opacity: 1,
    },
    velocity: {
      x: 0,
      y: 30,
    },
  });
}
