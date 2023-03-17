import { World } from '@jakeklassen/ecs2';
import { Control } from 'contro/dist/core/control.js';
import { Entity } from '../entity.js';
import { SpriteSheet } from '../spritesheet.js';
import { AudioManager } from '#/lib/audio-manager.js';

export function playerSystemFactory(
  world: World<Entity>,
  controls: Record<string, Control<any>>,
  viewport: { width: number; height: number },
  spritesheet: SpriteSheet,
  audioManager: AudioManager,
) {
  const players = world.archetype(
    'boxCollider',
    'direction',
    'playerTag',
    'sprite',
    'transform',
    'velocity',
  );

  const initialBulletTime = 8;
  let bulletTimer = 0;
  const bulletCooldown = 1;

  return (dt: number) => {
    bulletTimer -= bulletCooldown * dt;

    for (const entity of players.entities) {
      // Start each frame with the idle sprite
      entity.sprite.frame = {
        sourceX: spritesheet.player.idle.sourceX,
        sourceY: spritesheet.player.idle.sourceY,
        width: spritesheet.player.idle.frameWidth,
        height: spritesheet.player.idle.frameHeight,
      };

      entity.direction.x = 0;
      entity.direction.y = 0;

      if (controls.left.query()) {
        entity.direction.x = -1;
        entity.sprite.frame = {
          sourceX: spritesheet.player.bankLeft.sourceX,
          sourceY: spritesheet.player.bankLeft.sourceY,
          width: spritesheet.player.bankLeft.frameWidth,
          height: spritesheet.player.bankLeft.frameHeight,
        };
      } else if (controls.right.query()) {
        entity.direction.x = 1;
        entity.sprite.frame = {
          sourceX: spritesheet.player.bankRight.sourceX,
          sourceY: spritesheet.player.bankRight.sourceY,
          width: spritesheet.player.bankRight.frameWidth,
          height: spritesheet.player.bankRight.frameHeight,
        };
      }

      if (controls.up.query()) {
        entity.direction.y = -1;
      } else if (controls.down.query()) {
        entity.direction.y = 1;
      }

      if (controls.fire.query()) {
        if (bulletTimer <= 0) {
          bulletTimer = initialBulletTime * dt;

          // Spawn a bullet
          world.createEntity({
            boxCollider: spritesheet.bullet.boxCollider,
            direction: {
              x: 0,
              y: -1,
            },
            transform: {
              position: {
                x:
                  entity.transform.position.x +
                  spritesheet.bullet.frame.frameWidth / 4,
                y:
                  entity.transform.position.y -
                  spritesheet.bullet.frame.frameHeight,
              },
              rotation: 0,
              scale: {
                x: 1,
                y: 1,
              },
            },
            sprite: {
              frame: {
                sourceX: spritesheet.bullet.frame.sourceX,
                sourceY: spritesheet.bullet.frame.sourceY,
                width: spritesheet.bullet.frame.frameWidth,
                height: spritesheet.bullet.frame.frameHeight,
              },
              opacity: 1,
            },
            velocity: {
              x: 0,
              y: 120,
            },
          });

          audioManager.play('shoot', {
            loop: false,
          });
        }
      }

      entity.transform.position.x +=
        entity.velocity.x * entity.direction.x * dt;

      entity.transform.position.y +=
        entity.velocity.y * entity.direction.y * dt;

      // Clamp the player to the viewport
      if (
        entity.transform.position.x + entity.boxCollider.offsetX >
        viewport.width - entity.boxCollider.width
      ) {
        entity.transform.position.x =
          viewport.width -
          entity.boxCollider.width -
          entity.boxCollider.offsetX;
      } else if (entity.transform.position.x + entity.boxCollider.offsetX < 0) {
        entity.transform.position.x = -entity.boxCollider.offsetX;
      }

      if (
        entity.transform.position.y + entity.boxCollider.offsetY >
        viewport.height - entity.boxCollider.height
      ) {
        entity.transform.position.y =
          viewport.height -
          entity.boxCollider.height -
          entity.boxCollider.offsetY;
      } else if (entity.transform.position.y + entity.boxCollider.offsetY < 0) {
        entity.transform.position.y = -entity.boxCollider.offsetY;
      }
    }
  };
}
