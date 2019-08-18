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
  () => class extends Component { },
);

Components.forEach(C => C.bitmask);

console.log(`Created ${NUM_COMPONENTS} Component classes`);
memoryUsage();
console.log('\n');

// const componentMap = new Map();

// Components.forEach(Ctor => componentMap.set(Ctor, new Ctor()));

// console.log('Usage after components added to map');
// memoryUsage();
// console.log('\n');

// const simpleMap = new Map();

// Components.forEach(Ctor => simpleMap.set(Ctor.name, new Ctor()));

// console.log('Usage after components added to simple map');
// memoryUsage();
// console.log('\n');
