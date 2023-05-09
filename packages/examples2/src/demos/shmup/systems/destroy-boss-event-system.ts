import { rnd, rndInt } from '#/lib/math.js';
import { Easing } from '#/lib/tween.js';
import { World } from '@jakeklassen/ecs2';
import { spriteAnimationFactory } from '../components/sprite-animation.js';
import { spriteFactory } from '../components/sprite.js';
import { textBlinkAnimationFactory } from '../components/text-blink-animation.js';
import { transformFactory } from '../components/transform.js';
import { ttlFactory } from '../components/ttl.js';
import { tweenFactory } from '../components/tween.js';
import { Config } from '../config.js';
import { Pico8Colors, SpriteLayer } from '../constants.js';
import { LoadedContent } from '../content.js';
import { explosionFactory } from '../entity-factories/explosion.js';
import { Entity } from '../entity.js';
import { GameEvent } from '../game-events.js';
import { GameState } from '../game-state.js';
import { Scene } from '../scene.js';
import { SpriteSheet } from '../spritesheet.js';
import { animationDetailsFactory } from '../structures/animation-details.js';
import { TimeSpan, Timer } from '../timer.js';

export function destroyBossEventSystemFactory({
  config,
  content,
  gameState,
  scene,
  timer,
  world,
}: {
  config: Config;
  content: LoadedContent;
  gameState: GameState;
  scene: Scene;
  timer: Timer;
  world: World<Entity>;
}) {
  const events = world.archetype('eventDestroyBoss');
  const bosses = world.archetype(
    'direction',
    'enemyType',
    'sprite',
    'spriteAnimation',
    'tagBoss',
    'transform',
  );

  return function destroyBossEventSystem() {
    for (const event of events.entities) {
      world.deleteEntity(event);

      const [boss] = bosses.entities;

      if (boss == null) {
        break;
      }

      // Stop boss movement
      boss.direction.x = 0;
      boss.direction.y = 0;

      const enemyConfig = config.entities.enemies[boss.enemyType];

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

      // Disable collisions so we can't keep shooting it or fly into it
      world.removeEntityComponents(boss, 'boxCollider');

      // Shake the boss
      world.addEntityComponents(boss, 'tweens', [
        ...(boss.tweens ?? []).concat(
          tweenFactory('transform.position.x', {
            duration: 80,
            easing: Easing.InSine,
            from: boss.transform.position.x,
            to: boss.transform.position.x + 1,
            yoyo: true,
            fullSwing: true,
            maxIterations: Infinity,
          }),
        ),
      ]);

      world.addEntityComponents(boss, 'tagDisabled', true);

      world.createEntity({
        eventTriggerCameraShake: {
          durationMs: 4000,
          strength: 3,
        },
      });

      const explosionTimer = new TimeSpan(100, 0, true);

      timer.add(explosionTimer, () => {
        const explosionIndex = rndInt(content.explosions.height / 64);
        const sourceY = explosionIndex * 64;

        world.createEntity({
          eventPlaySound: {
            track: 'enemy-death',
            options: {
              loop: false,
            },
          },
        });

        world.createEntity({
          sprite: spriteFactory({
            frame: {
              sourceX: 0,
              sourceY,
              width: 64,
              height: 64,
            },
            layer: SpriteLayer.Explosion,
          }),
          spriteAnimation: spriteAnimationFactory(
            animationDetailsFactory(
              `explosion`,
              0,
              sourceY,
              content.explosions.width,
              64,
              64,
              64,
            ),
            100,
            false,
          ),
          spritesheet: 'explosions',
          transform: transformFactory({
            position: {
              x:
                boss.transform.position.x +
                rndInt(SpriteSheet.enemies.boss.frame.width) -
                32,
              y:
                boss.transform.position.y +
                rndInt(SpriteSheet.enemies.boss.frame.height) -
                32,
            },
          }),
        });
      });

      timer.add(new TimeSpan(4_100), () => {
        timer.remove(explosionTimer);

        // Show bonus score text
        world.createEntity({
          direction: {
            x: 0,
            y: -1,
          },
          text: {
            align: 'center',
            color: Pico8Colors.Color7,
            font: 'PICO-8',
            message: `${enemyConfig.score}`,
          },
          textBlinkAnimation: textBlinkAnimationFactory({
            colors: [Pico8Colors.Color7, Pico8Colors.Color8],
            colorSequence: [0, 1],
            durationMs: 100,
          }),
          transform: transformFactory({
            position: {
              x: boss.transform.position.x + 16,
              y: boss.transform.position.y + 12,
            },
          }),
          ttl: ttlFactory({ durationMs: 2000 }),
          velocity: {
            x: 0,
            y: 15,
          },
        });

        world.createEntity({
          eventPlaySound: {
            track: 'big-explosion',
            options: {
              loop: false,
            },
          },
        });

        // Slightly stronger shake
        world.createEntity({
          eventTriggerCameraShake: {
            durationMs: 250,
            strength: 6,
          },
        });

        // Shockwave
        world.createEntity({
          shockwave: {
            radius: 3,
            targetRadius: 25,
            color: Pico8Colors.Color7,
            speed: 105,
          },
          transform: transformFactory({
            position: {
              x:
                boss.transform.position.x +
                SpriteSheet.enemies.boss.frame.width / 2,
              y:
                boss.transform.position.y +
                SpriteSheet.enemies.boss.frame.height / 2,
            },
          }),
        });

        // Initial flash of the explosion
        world.createEntity({
          particle: {
            age: 0,
            maxAge: 0,
            color: Pico8Colors.Color7,
            radius: 25,
            shape: 'circle',
          },
          transform: transformFactory({
            position: {
              x:
                boss.transform.position.x +
                SpriteSheet.enemies.boss.frame.width / 2,
              y:
                boss.transform.position.y +
                SpriteSheet.enemies.boss.frame.height / 2,
            },
          }),
          velocity: {
            x: 0,
            y: 0,
          },
        });

        explosionFactory(world, {
          count: 60,
          particleFn: () => ({
            age: rnd(2),
            maxAge: 20 + rnd(20),
            color: Pico8Colors.Color7,
            radius: 1 + rnd(6),
            shape: 'circle',
          }),
          position: {
            x:
              boss.transform.position.x +
              SpriteSheet.enemies.boss.frame.width / 2,
            y:
              boss.transform.position.y +
              SpriteSheet.enemies.boss.frame.height / 2,
          },
          velocityFn: () => ({
            x: Math.random() * 200,
            y: Math.random() * 200,
          }),
        });

        explosionFactory(world, {
          count: 100,
          particleFn: () => ({
            age: rnd(2),
            maxAge: 20 + rnd(20),
            color: Pico8Colors.Color7,
            isBlue: true,
            radius: 1 + rnd(4),
            shape: 'circle',
            spark: true,
          }),
          position: {
            x:
              boss.transform.position.x +
              SpriteSheet.enemies.boss.frame.width / 2,
            y:
              boss.transform.position.y +
              SpriteSheet.enemies.boss.frame.height / 2,
          },
          velocityFn: () => ({
            x: Math.random() * 350,
            y: Math.random() * 350,
          }),
        });

        world.deleteEntity(boss);

        gameState.score += enemyConfig.score;
      });

      timer.add(new TimeSpan(7_000), () => {
        timer.remove(explosionTimer);

        scene.emit(GameEvent.GameWon);
      });
    }
  };
}
