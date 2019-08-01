import Benchmark, { Event } from 'benchmark';
import sample from 'lodash/sample';
import { Constructor, World } from '../src';
import { Component } from '../src/component';

// tslint:disable: max-classes-per-file no-console

const COMPONENTS_PER_ENTITY = 3;
const ENTITIES = 100_000;

const suite = new Benchmark.Suite();

class Color extends Component {}
class Rectangle extends Component {}
class BoxCollider2d extends Component {}
class Velocity2d extends Component {}
class PlayerTag extends Component {}
class EnemyTag extends Component {}
class TerrainTag extends Component {}

const components = [
  Color,
  Rectangle,
  BoxCollider2d,
  Velocity2d,
  PlayerTag,
  EnemyTag,
  TerrainTag,
];

const world = new World();
const entities = Array.from({ length: ENTITIES }, () => world.createEntity());
entities.forEach(entity => {
  Array.from(
    { length: COMPONENTS_PER_ENTITY },
    () => new (sample(components) as Constructor<Component>)(),
  ).forEach(component => world.addEntityComponent(entity, component));
});

suite
  .add(
    `World#view: ${ENTITIES} entities with ${COMPONENTS_PER_ENTITY} components each`,
    () => {
      world.view(BoxCollider2d, PlayerTag, Velocity2d);
    },
  )
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
