import Benchmark, { Event } from 'benchmark';
import sampleSize from 'lodash/sampleSize';
import { World } from '../src';
import { Component } from '../src/component';
import { memoryUsage } from './lib/memory';

// tslint:disable: max-classes-per-file no-console

const NUM_COMPONENTS = 1000;
const COMPONENTS_PER_ENTITY = 100;
const NUM_ENTITIES = 100_000;
const NUM_COMPONENTS_TO_SEARCH = 10;

const suite = new Benchmark.Suite();

const components = Array.from(
  { length: NUM_COMPONENTS },
  () => class extends Component {},
);

const world = new World();
const entities = Array.from({ length: NUM_ENTITIES }, () =>
  world.createEntity(),
);

for (const entity of entities) {
  world.addEntityComponents(
    entity,
    ...sampleSize(components, COMPONENTS_PER_ENTITY).map((ctor) => new ctor()),
  );
}

console.log('Memory usage before benchmark:');
memoryUsage();

suite
  .add(
    `World#view: ${NUM_ENTITIES} entities with ${COMPONENTS_PER_ENTITY} components each`,
    () => {
      const ctors = sampleSize(components, NUM_COMPONENTS_TO_SEARCH);
      world.view(...ctors);
    },
  )
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
