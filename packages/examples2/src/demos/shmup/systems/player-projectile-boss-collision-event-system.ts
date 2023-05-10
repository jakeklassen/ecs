import { World } from '@jakeklassen/ecs2';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { Pico8Colors } from '../constants.js';
import { destroyPlayerBulletFactory } from '../entity-factories/destroy-player-bullet.js';
import { Entity } from '../entity.js';
import { assertEnityHasOrThrow } from '../entity/assert.js';
import { SpriteSheet } from '../spritesheet.js';
import { animationDetailsFactory } from '../structures/animation-details.js';

export function playerProjectileBossCollisionEventSystemFactory({
  world,
}: {
  world: World<Entity>;
}) {
  const events = world.archetype('eventPlayerProjectileBossCollision');
  const bosses = world.archetype('sprite', 'spriteAnimation', 'tagBoss');

  /**
   * We need to disable the hurt timer when the boss is dead. Otherwise,
   * the boss will switch back to the idle animation when it's _dying_.
   */
  let disableHurtTimer = false;

  let hurtTimer = 0;

  /**
   * We need some duration to lock the boss in the hurt state so that
   * the animation doesn't toggle back to idle too quickly.
   */
  const hurtDurationSeconds = 0.2;

  return function playerProjectileBossCollisionEventSystem(dt: number) {
    if (!disableHurtTimer) {
      hurtTimer += dt;
    }

    if (hurtTimer >= hurtDurationSeconds && bosses.entities.size === 1) {
      const [boss] = bosses.entities;

      hurtTimer = 0;

      boss.sprite.paletteSwaps = [];

      // When the timer expires and boss is hurting, switch back to
      // the idle animation
      if (boss.spriteAnimation.animationDetails.name !== 'boss-idle') {
        boss.spriteAnimation = spriteAnimationFactory(
          animationDetailsFactory(
            'boss-idle',
            SpriteSheet.enemies.boss.animations.idle.sourceX,
            SpriteSheet.enemies.boss.animations.idle.sourceY,
            SpriteSheet.enemies.boss.animations.idle.width,
            SpriteSheet.enemies.boss.animations.idle.height,
            SpriteSheet.enemies.boss.animations.idle.frameWidth,
            SpriteSheet.enemies.boss.animations.idle.frameHeight,
          ),
          400,
          true,
        );
      }
    }

    for (const entity of events.entities) {
      const { eventPlayerProjectileBossCollision: event } = entity;
      const { boss, damage, projectile } = event;

      destroyPlayerBulletFactory({
        bullet: projectile,
        shockwave: projectile.tagBullet
          ? {
              location: {
                x:
                  (event.projectile.transform?.position.x ?? 0) +
                  (event.projectile.sprite?.frame.width ?? 0) / 2,
                y:
                  (event.projectile.transform?.position.y ?? 0) +
                  (event.projectile.sprite?.frame.height ?? 0) / 2,
              },
            }
          : undefined,
        world,
      });

      if (boss.invulnerable == null && boss.health != null) {
        hurtTimer = 0;

        if (boss.spriteAnimation != null) {
          // Change sprite animation to damage animation
          boss.spriteAnimation = spriteAnimationFactory(
            animationDetailsFactory(
              'boss-hurt',
              SpriteSheet.enemies.boss.animations.hurt.sourceX,
              SpriteSheet.enemies.boss.animations.hurt.sourceY,
              SpriteSheet.enemies.boss.animations.hurt.width,
              SpriteSheet.enemies.boss.animations.hurt.height,
              SpriteSheet.enemies.boss.animations.hurt.frameWidth,
              SpriteSheet.enemies.boss.animations.hurt.frameHeight,
            ),
            100,
            true,
          );
        }

        boss.health -= damage;

        assertEnityHasOrThrow(boss, 'enemyType', 'sprite');

        // Update sprite and palette swap the boss to indicate damage
        boss.sprite.frame = SpriteSheet.enemies.boss.hurt.frame;
        boss.sprite.paletteSwaps = [
          [Pico8Colors.Color3, Pico8Colors.Color8],
          [Pico8Colors.Color11, Pico8Colors.Color14],
        ];

        // Boss is dead
        if (boss.health <= 0) {
          disableHurtTimer = true;

          world.createEntity({
            eventDestroyBoss: true,
          });
        }
      }
    }
  };
}
