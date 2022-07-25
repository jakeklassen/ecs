import { JsonObject } from 'type-fest';

/**
Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
@category Class
*/
type Constructor<T, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

/**
Matches a [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
@category Class
*/
type Class<T, Arguments extends unknown[] = any[]> = Constructor<
  T,
  Arguments
> & { prototype: T };

type IsEmptyObject<T> = keyof T extends never ? true : false;

type NonFunctionProperties<T> = Exclude<T, NonFunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

export type Component = JsonObject;

export type ComponentFactory<
  T extends Component = Component,
  Arguments extends T = T,
> = (args: Arguments) => T;

export type ComponentConstructor<T extends Component = Component> =
  IsEmptyObject<T> extends true
    ? never
    : new (...arguments_: any[]) => keyof T extends NonFunctionPropertyNames<T>
        ? T
        : never;

class Empty {}

class Name {
  constructor(public name: string) {}
}

class Human {
  constructor(public name: string, public age: number) {}

  sayHello() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

declare function takeAComponent<T>(component: ComponentConstructor<T>): T;

takeAComponent(Name);
takeAComponent(Empty);
takeAComponent(Human);

class Color {
  constructor(public color = 'black') {}
}

const colorFactory = (color: string) => ({ color });
const _factory: ComponentFactory<ReturnType<typeof colorFactory>> =
  colorFactory;

_factory({
  color: 'red',
}).color;
