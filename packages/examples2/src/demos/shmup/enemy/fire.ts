import { AudioManager } from '#/lib/audio-manager.js';
import { World } from '@jakeklassen/ecs2';
import { CollisionMasks } from '../bitmasks.js';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { transformFactory } from '../components/transform.js';
import { Pico8Colors } from '../constants.js';
import { Entity } from '../entity.js';
import { SpriteSheet } from '../spritesheet.js';
import { animationDetailsFactory } from '../structures/animation-details.js';

export function fire({
  angle,
  audioManager,
  enemy,
  speed,
  world,
}: {
  angle: number;
  audioManager: AudioManager;
  enemy: Entity;
  speed: number;
  world: World<Entity>;
}) {
  const transform = transformFactory({
    position: {
      x: enemy.transform?.position.x ?? 0 + 3,
      y: enemy.transform?.position.y ?? 0 + 6,
    },
  });

  if (enemy.enemyType === 'yellowShip') {
    transform.position.x = enemy.transform?.position.x ?? 0 + 7;
    transform.position.y = enemy.transform?.position.y ?? 0 + 13;
  } else if (enemy.enemyType === 'boss') {
    transform.position.x = enemy.transform?.position.x ?? 0 + 15;
    transform.position.y = enemy.transform?.position.y ?? 0 + 23;
  }

  const boxCollider = {
    offsetX: SpriteSheet.enemyBullet.boxCollider.offsetX,
    offsetY: SpriteSheet.enemyBullet.boxCollider.offsetY,
    width: SpriteSheet.enemyBullet.boxCollider.width,
    height: SpriteSheet.enemyBullet.boxCollider.height,
  };

  const sprite: NonNullable<Entity['sprite']> = {
    frame: {
      sourceX: SpriteSheet.enemyBullet.frame.sourceX,
      sourceY: SpriteSheet.enemyBullet.frame.sourceY,
      width: SpriteSheet.enemyBullet.frame.width,
      height: SpriteSheet.enemyBullet.frame.height,
    },
    opacity: 1,
  };

  const spriteAnimation = spriteAnimationFactory(
    animationDetailsFactory(
      'enemy-bullet',
      SpriteSheet.enemyBullet.animations.idle.sourceX,
      SpriteSheet.enemyBullet.animations.idle.sourceY,
      SpriteSheet.enemyBullet.animations.idle.width,
      SpriteSheet.enemyBullet.animations.idle.height,
      SpriteSheet.enemyBullet.animations.idle.frameWidth,
      SpriteSheet.enemyBullet.animations.idle.frameHeight,
    ),
    500,
    true,
    [0, 1, 2, 1],
  );

  const velocity = {
    x: Math.sin(angle) * speed,
    y: Math.cos(angle) * speed,
  };

  const direction = {
    x: Math.sign(velocity.x),
    y: Math.sign(velocity.y),
  };

  velocity.x = Math.abs(velocity.x);
  velocity.y = Math.abs(velocity.y);

  world.createEntity({
    boxCollider,
    collisionLayer: CollisionMasks.EnemyProjectile,
    collisionMask: CollisionMasks.Player,
    direction,
    destroyOnViewportExit: true,
    sprite,
    spriteAnimation,
    tagEnemyProjectile: true,
    transform,
    velocity,
  });

  if (enemy.enemyType !== 'boss') {
    world.addEntityComponents(enemy, 'flash', {
      alpha: 1,
      color: Pico8Colors.Color7,
      durationMs: 120,
      elapsedMs: 0,
    });

    audioManager.play('enemy-projectile', {
      loop: false,
    });
  }
}
