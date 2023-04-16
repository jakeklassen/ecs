import { World } from '@jakeklassen/ecs2';
import { CollisionMasks } from '../bitmasks.js';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { transformFactory } from '../components/transform.js';
import { Config } from '../config.js';
import { Entity } from '../entity.js';
import { SpriteSheet } from '../spritesheet.js';
import { animationDetailsFactory } from '../structures/animation-details.js';
import { tweenFactory } from '../components/tween.js';
import { Easing } from '#/lib/tween.js';
import { TimeSpan, Timer } from '../timer.js';

function isValidWaveNumber(
  waveNumber: number,
  config: Config,
): waveNumber is keyof typeof config.waves {
  return waveNumber in config.waves;
}

export function spawnWaveSystemFactory({
  config,
  spriteSheet,
  timer,
  world,
}: {
  config: Config;
  spriteSheet: SpriteSheet;
  timer: Timer;
  world: World<Entity>;
}) {
  const nextWaveEvents = world.archetype('eventSpawnWave');
  const maxMaves = Object.keys(config.waves).length;

  return (dt: number) => {
    const [entity] = nextWaveEvents.entities;

    if (entity == null) {
      return;
    }

    const waveNumber = entity.eventSpawnWave.waveNumber;

    if (waveNumber > maxMaves) {
      // scene emit game win
      return;
    }

    if (!isValidWaveNumber(waveNumber, config)) {
      throw new Error(`Invalid wave number: ${waveNumber}`);
    }

    const wave = config.waves[waveNumber];

    for (let y = 0; y < wave.enemies.length; y++) {
      const line = wave.enemies[y];

      for (let x = 0; x < 10; x++) {
        const enemyType = line[x];

        if (enemyType === 0) {
          continue;
        }

        const xPosition = (x + 1) * 12 - 6;
        const yPosition = 4 + (y + 1) * 12;
        const wait = (x + 1) * 3 * dt;

        if (enemyType === 1) {
          timer.add(new TimeSpan(wait), () =>
            world.createEntity({
              boxCollider: SpriteSheet.enemies.greenAlien.boxCollider,
              collisionLayer: CollisionMasks.Enemy,
              collisionMask:
                CollisionMasks.PlayerProjectile | CollisionMasks.Player,
              health: config.entities.enemies.greenAlien.startingHealth,
              sleep: {
                durationMs: wait,
                elapsedMs: 0,
              },
              sprite: {
                frame: {
                  sourceX: SpriteSheet.enemies.greenAlien.frame.sourceX,
                  sourceY: SpriteSheet.enemies.greenAlien.frame.sourceY,
                  width: SpriteSheet.enemies.greenAlien.frame.width,
                  height: SpriteSheet.enemies.greenAlien.frame.height,
                },
                opacity: 1,
              },
              spriteAnimation: spriteAnimationFactory(
                animationDetailsFactory(
                  'alien-idle',
                  spriteSheet.enemies.greenAlien.animations.idle.sourceX,
                  spriteSheet.enemies.greenAlien.animations.idle.sourceY,
                  spriteSheet.enemies.greenAlien.animations.idle.width,
                  spriteSheet.enemies.greenAlien.animations.idle.height,
                  spriteSheet.enemies.greenAlien.animations.idle.frameWidth,
                  spriteSheet.enemies.greenAlien.animations.idle.frameHeight,
                ),
                400,
                true,
              ),
              tagEnemy: true,
              transform: transformFactory({
                position: {
                  x: xPosition,
                  y: yPosition,
                },
              }),
              tweens: [
                tweenFactory('transform.position.x', {
                  from: xPosition * 1.25 - 16,
                  to: xPosition,
                  duration: 800,
                  easing: Easing.OutSine,
                }),
                tweenFactory('transform.position.y', {
                  from: yPosition - 66,
                  to: yPosition,
                  duration: 800,
                  easing: Easing.OutSine,
                }),
              ],
            }),
          );
        } else if (enemyType === 2) {
          timer.add(new TimeSpan(wait), () =>
            world.createEntity({
              boxCollider: SpriteSheet.enemies.redFlameGuy.boxCollider,
              collisionLayer: CollisionMasks.Enemy,
              collisionMask:
                CollisionMasks.PlayerProjectile | CollisionMasks.Player,
              health: config.entities.enemies.redFlameGuy.startingHealth,
              sleep: {
                durationMs: wait,
                elapsedMs: 0,
              },
              sprite: {
                frame: {
                  sourceX: SpriteSheet.enemies.redFlameGuy.frame.sourceX,
                  sourceY: SpriteSheet.enemies.redFlameGuy.frame.sourceY,
                  width: SpriteSheet.enemies.redFlameGuy.frame.width,
                  height: SpriteSheet.enemies.redFlameGuy.frame.height,
                },
                opacity: 1,
              },
              spriteAnimation: spriteAnimationFactory(
                animationDetailsFactory(
                  'alien-idle',
                  spriteSheet.enemies.redFlameGuy.animations.idle.sourceX,
                  spriteSheet.enemies.redFlameGuy.animations.idle.sourceY,
                  spriteSheet.enemies.redFlameGuy.animations.idle.width,
                  spriteSheet.enemies.redFlameGuy.animations.idle.height,
                  spriteSheet.enemies.redFlameGuy.animations.idle.frameWidth,
                  spriteSheet.enemies.redFlameGuy.animations.idle.frameHeight,
                ),
                400,
                true,
              ),
              tagEnemy: true,
              transform: transformFactory({
                position: {
                  x: xPosition,
                  y: yPosition,
                },
              }),
              tweens: [
                tweenFactory('transform.position.x', {
                  from: xPosition * 1.25 - 16,
                  to: xPosition,
                  duration: 800,
                  easing: Easing.OutSine,
                }),
                tweenFactory('transform.position.y', {
                  from: yPosition - 66,
                  to: yPosition,
                  duration: 800,
                  easing: Easing.OutSine,
                }),
              ],
            }),
          );
        } else if (enemyType === 3) {
          timer.add(new TimeSpan(wait), () =>
            world.createEntity({
              boxCollider: SpriteSheet.enemies.spinningShip.boxCollider,
              collisionLayer: CollisionMasks.Enemy,
              collisionMask:
                CollisionMasks.PlayerProjectile | CollisionMasks.Player,
              health: config.entities.enemies.spinningShip.startingHealth,
              sleep: {
                durationMs: wait,
                elapsedMs: 0,
              },
              sprite: {
                frame: {
                  sourceX: SpriteSheet.enemies.spinningShip.frame.sourceX,
                  sourceY: SpriteSheet.enemies.spinningShip.frame.sourceY,
                  width: SpriteSheet.enemies.spinningShip.frame.width,
                  height: SpriteSheet.enemies.spinningShip.frame.height,
                },
                opacity: 1,
              },
              spriteAnimation: spriteAnimationFactory(
                animationDetailsFactory(
                  'alien-idle',
                  spriteSheet.enemies.spinningShip.animations.idle.sourceX,
                  spriteSheet.enemies.spinningShip.animations.idle.sourceY,
                  spriteSheet.enemies.spinningShip.animations.idle.width,
                  spriteSheet.enemies.spinningShip.animations.idle.height,
                  spriteSheet.enemies.spinningShip.animations.idle.frameWidth,
                  spriteSheet.enemies.spinningShip.animations.idle.frameHeight,
                ),
                400,
                true,
              ),
              tagEnemy: true,
              transform: transformFactory({
                position: {
                  x: xPosition,
                  y: yPosition,
                },
              }),
              tweens: [
                tweenFactory('transform.position.x', {
                  from: xPosition * 1.25 - 16,
                  to: xPosition,
                  duration: 800,
                  easing: Easing.OutSine,
                }),
                tweenFactory('transform.position.y', {
                  from: yPosition - 66,
                  to: yPosition,
                  duration: 800,
                  easing: Easing.OutSine,
                }),
              ],
            }),
          );
        } else if (enemyType === 4) {
          timer.add(new TimeSpan(wait), () =>
            world.createEntity({
              boxCollider: SpriteSheet.enemies.yellowShip.boxCollider,
              collisionLayer: CollisionMasks.Enemy,
              collisionMask:
                CollisionMasks.PlayerProjectile | CollisionMasks.Player,
              health: config.entities.enemies.yellowShip.startingHealth,
              sleep: {
                durationMs: wait,
                elapsedMs: 0,
              },
              sprite: {
                frame: {
                  sourceX: SpriteSheet.enemies.yellowShip.frame.sourceX,
                  sourceY: SpriteSheet.enemies.yellowShip.frame.sourceY,
                  width: SpriteSheet.enemies.yellowShip.frame.width,
                  height: SpriteSheet.enemies.yellowShip.frame.height,
                },
                opacity: 1,
              },
              spriteAnimation: spriteAnimationFactory(
                animationDetailsFactory(
                  'alien-idle',
                  spriteSheet.enemies.yellowShip.animations.idle.sourceX,
                  spriteSheet.enemies.yellowShip.animations.idle.sourceY,
                  spriteSheet.enemies.yellowShip.animations.idle.width,
                  spriteSheet.enemies.yellowShip.animations.idle.height,
                  spriteSheet.enemies.yellowShip.animations.idle.frameWidth,
                  spriteSheet.enemies.yellowShip.animations.idle.frameHeight,
                ),
                400,
                true,
              ),
              tagEnemy: true,
              transform: transformFactory({
                position: {
                  x: xPosition,
                  y: yPosition,
                },
              }),
              tweens: [
                tweenFactory('transform.position.x', {
                  from: xPosition * 1.25 - 16,
                  to: xPosition,
                  duration: 800,
                  easing: Easing.OutSine,
                }),
                tweenFactory('transform.position.y', {
                  from: yPosition - 66,
                  to: yPosition,
                  duration: 800,
                  easing: Easing.OutSine,
                }),
              ],
            }),
          );
        } else if (enemyType === 5) {
          timer.add(new TimeSpan(wait), () =>
            world.createEntity({
              boxCollider: SpriteSheet.enemies.boss.boxCollider,
              collisionLayer: CollisionMasks.Enemy,
              collisionMask:
                CollisionMasks.PlayerProjectile | CollisionMasks.Player,
              health: config.entities.enemies.boss.startingHealth,
              sleep: {
                durationMs: wait,
                elapsedMs: 0,
              },
              sprite: {
                frame: {
                  sourceX: SpriteSheet.enemies.boss.frame.sourceX,
                  sourceY: SpriteSheet.enemies.boss.frame.sourceY,
                  width: SpriteSheet.enemies.boss.frame.width,
                  height: SpriteSheet.enemies.boss.frame.height,
                },
                opacity: 1,
              },
              spriteAnimation: spriteAnimationFactory(
                animationDetailsFactory(
                  'alien-idle',
                  spriteSheet.enemies.boss.animations.idle.sourceX,
                  spriteSheet.enemies.boss.animations.idle.sourceY,
                  spriteSheet.enemies.boss.animations.idle.width,
                  spriteSheet.enemies.boss.animations.idle.height,
                  spriteSheet.enemies.boss.animations.idle.frameWidth,
                  spriteSheet.enemies.boss.animations.idle.frameHeight,
                ),
                400,
                true,
              ),
              tagEnemy: true,
              transform: transformFactory({
                position: {
                  x: xPosition,
                  y: yPosition,
                },
              }),
              tweens: [
                tweenFactory('transform.position.x', {
                  from: xPosition * 1.25 - 16,
                  to: xPosition,
                  duration: 800,
                  easing: Easing.OutSine,
                }),
                tweenFactory('transform.position.y', {
                  from: yPosition - 66,
                  to: yPosition,
                  duration: 800,
                  easing: Easing.OutSine,
                }),
              ],
            }),
          );
        }
      }
    }

    world.deleteEntity(entity);
  };
}
