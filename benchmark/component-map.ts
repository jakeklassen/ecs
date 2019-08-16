import Benchmark, { Event } from 'benchmark';
import sample = require('lodash/sample');
import sampleSize from 'lodash/sampleSize';
import { Component, ComponentConstructor } from '../src/component';
import { ComponentMap } from '../src/component-map';
import { memoryUsage } from './lib/memory';

// tslint:disable: no-console

const NUM_COMPONENTS = 1_000;
const COMPONENTS_PER_MAP = 100;

console.log('Pre benchmark memory:');
memoryUsage();
console.log('\n');

const Components: ComponentConstructor[] = Array.from(
  { length: NUM_COMPONENTS },
  () => class extends Component {},
);

Components.forEach(C => C.bitmask);

console.log(`Created ${NUM_COMPONENTS} Component classes`);
memoryUsage();
console.log('\n');

const samples: Component[][] = Array(100)
  .fill(0)
  .map(() =>
    sampleSize(Components, COMPONENTS_PER_MAP).map(ctor => new ctor()),
  );

const suite = new Benchmark.Suite();
const componentMap = new ComponentMap();

suite
  .add('ComponentMap#set', () => {
    sample(samples)!.forEach(component => componentMap.set(component));
  })
  .add('ComponentMap#has', () => {
    componentMap.has(sample(Components)!);
  })
  .add('ComponentMap#get', () => {
    componentMap.get(sample(Components)!);
  })
  .add('ComponentMap#remove', () => {
    sample(samples)!.forEach(component =>
      componentMap.remove(component.constructor as ComponentConstructor),
    );
  })
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('\nMemory usage after benchmark');
    memoryUsage();
    console.log('\n');
  })
  .run({ async: true });
