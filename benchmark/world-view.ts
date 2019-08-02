import Benchmark, { Event } from 'benchmark';
import sampleSize from 'lodash/sampleSize';
import { World } from '../src';
import { Component } from '../src/component';

// tslint:disable: max-classes-per-file no-console

const NUM_COMPONENTS = 1000;
const COMPONENTS_PER_ENTITY = 100;
const NUM_ENTITIES = 100_000;

const suite = new Benchmark.Suite();

const components = Array.from(
  { length: NUM_COMPONENTS },
  () => class extends Component {},
);

const world = new World();
const entities = Array.from({ length: NUM_ENTITIES }, () =>
  world.createEntity(),
);

entities.forEach(entity => {
  sampleSize(components, COMPONENTS_PER_ENTITY).forEach(ctor =>
    world.addEntityComponent(entity, new ctor()),
  );
});

suite
  .add(
    `World#view: ${NUM_ENTITIES} entities with ${COMPONENTS_PER_ENTITY} components each`,
    () => {
      const [Ctor1, Ctor2, Ctor3] = components;
      world.view(Ctor1, Ctor2, Ctor3);
    },
  )
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
