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

  const handledEntities = new Set<Entity>();

  return function collisionSystem(_dt: number) {
    handledEntities.clear();

    for (const entity of collidables.entities) {
      if (handledEntities.has(entity)) {
        continue;
      }

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

        const { boxCollider, transform } = entity;

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

        if (intersects(aabb, otherAabb) === false) {
          continue;
        }

        // Determine if either entity is the player
        const player = entity.tagPlayer
          ? entity
          : otherEntity.tagPlayer
          ? otherEntity
          : null;

        const pickup = entity.tagPickup
          ? entity
          : otherEntity.tagPickup
          ? otherEntity
          : null;

        const enemy = entity.tagEnemy
          ? entity
          : otherEntity.tagEnemy
          ? otherEntity
          : null;

        const playerBullet =
          entity.tagBullet || entity.tagBomb
            ? entity
            : otherEntity.tagBullet || otherEntity.tagBomb
            ? otherEntity
            : null;

        const enemyBullet = entity.tagEnemyBullet
          ? entity
          : otherEntity.tagEnemyBullet
          ? otherEntity
          : null;

        if (playerBullet != null && enemy != null) {
          world.createEntity({
            eventPlayerProjectileEnemyCollision: {
              projectile: entity.tagBullet ? entity : otherEntity,
              enemy: entity.tagBullet ? otherEntity : entity,
              damage: playerBullet.tagBomb ? 1000 : 1,
            },
          });
        } else if (player != null) {
          if (pickup != null) {
            world.createEntity({
              eventPlayerPickupCollision: {
                player,
                pickup,
              },
            });
          } else if (player.invulnerable == null) {
            if (enemyBullet != null) {
              world.createEntity({
                eventPlayerEnemyCollision: {
                  player,
                  enemy: enemyBullet,
                },
              });
            } else if (enemy != null) {
              world.createEntity({
                eventPlayerEnemyCollision: {
                  player,
                  enemy,
                },
              });
            }
          }
        }

        handledEntities.add(entity);
        handledEntities.add(otherEntity);

        // We're done with this entity, so break out of the loop
        break;
      }
    }
  };
}
