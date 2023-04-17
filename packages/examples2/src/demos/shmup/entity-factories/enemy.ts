import { World } from '@jakeklassen/ecs2';
import { CollisionMasks } from '../bitmasks.js';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { config } from '../config.js';
import { Entity } from '../entity.js';
import { SpriteSheet } from '../spritesheet.js';
import { animationDetailsFactory } from '../structures/animation-details.js';

function enemyFactory<
  T extends Entity,
  E extends keyof typeof SpriteSheet.enemies,
>({
  components,
  enemyName,
  world,
}: {
  components: T;
  enemyName: E;
  world: World<Entity>;
}) {
  const enemy = SpriteSheet.enemies[enemyName];

  return world.createEntity({
    boxCollider: enemy.boxCollider,
    collisionLayer: CollisionMasks.Enemy,
    collisionMask: CollisionMasks.PlayerProjectile | CollisionMasks.Player,
    health: config.entities.enemies[enemyName].startingHealth,
    sprite: {
      frame: {
        sourceX: enemy.frame.sourceX,
        sourceY: enemy.frame.sourceY,
        width: enemy.frame.width,
        height: enemy.frame.height,
      },
      opacity: 1,
    },
    spriteAnimation: spriteAnimationFactory(
      animationDetailsFactory(
        `${enemyName}-idle`,
        enemy.animations.idle.sourceX,
        enemy.animations.idle.sourceY,
        enemy.animations.idle.width,
        enemy.animations.idle.height,
        enemy.animations.idle.frameWidth,
        enemy.animations.idle.frameHeight,
      ),
      400,
      true,
    ),
    tagEnemy: true,
    ...components,
  });
}

export function greenAlienFactory<T extends Entity>({
  components,
  world,
}: {
  components: T;
  world: World<Entity>;
}) {
  return enemyFactory({
    components,
    enemyName: 'greenAlien',
    world,
  });
}

export function redFlameGuyFactory<T extends Entity>({
  components,
  world,
}: {
  components: T;
  world: World<Entity>;
}) {
  return enemyFactory({
    components,
    enemyName: 'redFlameGuy',
    world,
  });
}

export function spinningShipFactory<T extends Entity>({
  components,
  world,
}: {
  components: T;
  world: World<Entity>;
}) {
  return enemyFactory({
    components,
    enemyName: 'spinningShip',
    world,
  });
}

export function yellowShipFactory<T extends Entity>({
  components,
  world,
}: {
  components: T;
  world: World<Entity>;
}) {
  return enemyFactory({
    components,
    enemyName: 'yellowShip',
    world,
  });
}

export function bossFactory<T extends Entity>({
  components,
  world,
}: {
  components: T;
  world: World<Entity>;
}) {
  return enemyFactory({
    components,
    enemyName: 'boss',
    world,
  });
}
