import { World } from '@jakeklassen/ecs2';
import { Pico8Colors } from '../constants.js';
import { Entity } from '../entity.js';

function determineParticlColorFromAge(
  particle: NonNullable<Entity['particle']>,
  bias: 'red' | 'blue',
) {
  if (bias === 'red') {
    if (particle.age > 15) {
      return Pico8Colors.Color5;
    }

    if (particle.age > 12) {
      return Pico8Colors.Color2;
    }

    if (particle.age > 10) {
      return Pico8Colors.Color8;
    }

    if (particle.age > 7) {
      return Pico8Colors.Color9;
    }

    if (particle.age > 5) {
      return Pico8Colors.Color10;
    }
  } else if (bias === 'blue') {
    if (particle.age > 15) {
      return Pico8Colors.Color1;
    }

    if (particle.age > 12) {
      return Pico8Colors.Color1;
    }

    if (particle.age > 10) {
      return Pico8Colors.Color13;
    }

    if (particle.age > 7) {
      return Pico8Colors.Color12;
    }

    if (particle.age > 5) {
      return Pico8Colors.Color6;
    }
  }

  return particle.color;
}

export function particleSystemFactory({ world }: { world: World<Entity> }) {
  const renderables = world.archetype('particle', 'velocity');

  return function particleSystem(dt: number) {
    for (const entity of renderables.entities) {
      const { particle, velocity } = entity;

      // FIXME: Code smell `30 * dt` - need to extract `30`
      particle.age += 30 * dt;
      velocity.x *= 0.85;
      velocity.y *= 0.85;

      if (particle.age >= particle.maxAge) {
        particle.radius -= 0.5;

        if (particle.radius <= 0) {
          world.deleteEntity(entity);
          continue;
        }
      }

      // There are two color biases, red for enemies and blue for the player.
      particle.color = particle.isBlue
        ? determineParticlColorFromAge(particle, 'blue')
        : determineParticlColorFromAge(particle, 'red');
    }
  };
}
