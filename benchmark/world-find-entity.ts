import Benchmark, { Event } from 'benchmark';
import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';
import { World } from '../src';
import { Component } from '../src/component';
import { memoryUsage } from './lib/memory';

// tslint:disable: no-console

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
    ...sampleSize(components, COMPONENTS_PER_ENTITY).map(ctor => new ctor()),
  );
}

console.log('Memory usage before benchmark:');
memoryUsage();

suite
  .add(
    `World#findEntity: ${NUM_ENTITIES} entities with ${COMPONENTS_PER_ENTITY} components each`,
    () => {
      const entity = sample(entities)!;
      const entityComponents = world.getEntityComponents(entity)!.keys();
      const searchedComponents = sampleSize(
        [...entityComponents],
        NUM_COMPONENTS_TO_SEARCH,
      );
      world.findEntity(...searchedComponents);
    },
  )
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
