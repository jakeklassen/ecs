import sampleSize from 'lodash/sampleSize';
import { Component, ComponentConstructor } from '../src/component';
import { ComponentMap } from '../src/component-map';
import { memoryUsage } from './lib/memory';

// tslint:disable: no-console

const NUM_COMPONENTS = 100_000;
const COMPONENTS_PER_MAP = 100;

console.log('Pre benchmark memory:');
memoryUsage();
console.log('\n');

const Components: ComponentConstructor[] = Array.from(
  { length: NUM_COMPONENTS },
  () => class extends Component {},
);

Components.forEach((C) => C.bitmask);

console.log(`Usage after creating ${NUM_COMPONENTS} Component classes`);
memoryUsage();
console.log('\n');

const map = new ComponentMap();

const componentSample = sampleSize(Components, COMPONENTS_PER_MAP);

componentSample.forEach((ctor) => map.set(new ctor()));

console.log(
  `Usage after setting ${COMPONENTS_PER_MAP} component in component map`,
);
memoryUsage();
console.log('\n');
