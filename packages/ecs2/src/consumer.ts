import { World } from './world.js';

type Entity = {
  position?: { x: number; y: number };
  velocity?: { x: number; y: number };
  color?: string;
};

const world = new World<Entity>();

const e = world.createEntity({
  position: { x: 0, y: 0 },
  velocity: { x: 1, y: 1 },
});

world.addEntityComponents(e, 'color', 'red');

const moving = world.archetype('position', 'velocity');

function physicsSystem(dt: number) {
  for (const entity of moving.entities) {
    entity.color?.toLocaleLowerCase();
    entity.position.x += entity.velocity.x * dt;
  }
}

physicsSystem(1 / 60);

world.createEntity({
  position: { x: 0, y: 0 },
  velocity: { x: 1, y: 1 },
});

console.log(world.entities);
