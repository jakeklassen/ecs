import { intersects } from '#/lib/collision/aabb.js';
import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function collisionSystemFactory({ world }: { world: World<Entity> }) {
  const collidables = world.archetype(
    'boxCollider',
    'collisionLayer',
    'collisionMask',
    'transform',
  );

  return function collisionSystem(_dt: number) {
    const handledEntities = new Set<Entity>();

    for (const entity of collidables.entities) {
      const { boxCollider, transform } = entity;

      for (const otherEntity of collidables.entities) {
        if (entity === otherEntity) {
          continue;
        }

        if (handledEntities.has(otherEntity)) {
          continue;
        }

        // Make sure entityA's collision layer is a subset of entityB's collision mask
        if (
          (entity.collisionLayer & otherEntity.collisionMask) !==
          entity.collisionLayer
        ) {
          continue;
        }

        const { boxCollider: otherBoxCollider, transform: otherTransform } =
          otherEntity;

        const x = transform.position.x + boxCollider.offsetX;
        const y = transform.position.y + boxCollider.offsetY;
        const otherX = otherTransform.position.x + otherBoxCollider.offsetX;
        const otherY = otherTransform.position.y + otherBoxCollider.offsetY;

        const aabb = {
          position: {
            x,
            y,
          },
          width: boxCollider.width,
          height: boxCollider.height,
        };

        const otherAabb = {
          position: {
            x: otherX,
            y: otherY,
          },
          width: otherBoxCollider.width,
          height: otherBoxCollider.height,
        };

        if (intersects(aabb, otherAabb)) {
          if (
            (entity.tagBullet && otherEntity.tagEnemy) ||
            (entity.tagEnemy && otherEntity.tagBullet)
          ) {
            world.createEntity({
              eventPlayerProjectileEnemyCollision: {
                projectile: entity.tagBullet ? entity : otherEntity,
                enemy: entity.tagBullet ? otherEntity : entity,
              },
            });
          } else if (
            (entity.tagPlayer && otherEntity.tagEnemy) ||
            (entity.tagEnemy && otherEntity.tagPlayer)
          ) {
            world.createEntity({
              eventPlayerEnemyCollision: {
                player: entity.tagPlayer ? entity : otherEntity,
                enemy: entity.tagPlayer ? otherEntity : entity,
              },
            });
          }
        }
      }

      handledEntities.add(entity);
    }
  };
}
