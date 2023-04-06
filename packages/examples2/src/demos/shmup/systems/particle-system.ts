import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function particleSystemFactory({ world }: { world: World<Entity> }) {
  const renderables = world.archetype('particle', 'velocity');

  return (dt: number) => {
    for (const entity of renderables.entities) {
      const { particle, velocity } = entity;

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

      particle.color = '#FFF1E8';

      if (particle.isBlue == null) {
        if (particle.age > 5) {
          particle.color = '#FFEC27';
        }

        if (particle.age > 7) {
          particle.color = '#FFA300';
        }

        if (particle.age > 10) {
          particle.color = '#FF004D';
        }

        if (particle.age > 12) {
          particle.color = '#7E2553';
        }

        if (particle.age > 15) {
          particle.color = '#5F574F';
        }
      } else {
        if (particle.age > 5) {
          particle.color = '#C2C3C7';
        }

        if (particle.age > 7) {
          particle.color = '#FFA300';
        }

        if (particle.age > 10) {
          particle.color = '#FF004D';
        }

        if (particle.age > 12) {
          particle.color = '#7E2553';
        }

        if (particle.age > 15) {
          particle.color = '#5F574F';
        }
      }
    }
  };
}
