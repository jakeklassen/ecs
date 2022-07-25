import { JsonObject, UnionToIntersection } from 'type-fest';

type IsEmptyComponent<T> = keyof T extends never ? true : false;

// Will not protect against `get` and `set`
type Component = JsonObject;

type ComponentFactory<T extends Component = Component> = {
  readonly __name: string;
  (...args: any[]): T;
};

type ComponentMap = Record<string, Component>;

type EntityId = number;

type ComponentFilter<T> = UnionToIntersection<
  T extends ComponentFactory<infer U> ? Record<T['__name'], U> : never
>;

class World {
  // Map chosen because when using numeric keys and serializing, they respect
  // this number type! This doesn't seem to be true of objects.
  #entities = new Map<EntityId, ComponentMap>();

  addEntityComponent<T extends ComponentFactory>(
    entity: EntityId,
    factory: T,
    component: ReturnType<typeof factory>,
  ) {
    if (!this.#entities.has(entity)) {
      this.#entities.set(entity, {});
    }

    this.#entities.get(entity)![factory.__name] = component;

    return this;
  }

  view<T extends ComponentFactory[]>(
    ...factories: T
  ): [EntityId, ComponentFilter<T[number]>][] {
    const result: [EntityId, ComponentFilter<T[number]>][] = [];

    for (const [entity, components] of this.#entities.entries()) {
      if (factories.every((factory) => components[factory.__name] != null)) {
        result.push([entity, components as ComponentFilter<T[number]>]);
      }
    }

    return result;
  }

  log() {
    console.log(JSON.stringify(Array.from(this.#entities.entries()), null, 2));
  }
}

function componentFactoryInit() {
  const componentNames = new Set<string>();

  // Bitmask starter
  let n = 0n;

  return function <
    N extends string,
    F extends (() => Component) | ((...args: any[]) => Component),
  >(__name: N, factory: F) {
    if (componentNames.has(__name)) {
      throw new Error(`Component ${__name} is already in use`);
    }

    componentNames.add(__name);

    const mask = 1n << n++;

    Object.defineProperty(factory, 'mask', {
      writable: false,
      configurable: false,
      value: {
        value: mask,
        index: Number(n - 1n),
      },
    });

    Object.defineProperty(factory, '__name', {
      writable: false,
      configurable: false,
      value: __name,
    });

    Object.defineProperty(factory, 'name', {
      writable: false,
      configurable: false,
      value: __name,
    });

    return factory as IsEmptyComponent<ReturnType<F>> extends true
      ? never
      : F & {
          readonly __name: typeof __name;
          readonly mask: { value: bigint; index: number };
        };
  };
}

const component = componentFactoryInit();

const playerTagFactory = component('playerTag', () => ({}));

// 😱 how could you ❓❗
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const _tag = playerTagFactory();

const colorFactory = component('color', (r = 0, b = 0, g = 0, a = 0) => ({
  r,
  g,
  b,
  a,
}));

const positionFactory = component('position', (x = 0, y = 0) => ({
  x,
  y,
}));

const velocityFactory = component('velocity', (x = 0, y = 0) => ({ x, y }));

const position = positionFactory();
const velocity = velocityFactory();
const color = colorFactory(255, 255, 255, 255);

const world = new World();

const entityA = 1;
const entityB = 2;

world
  .addEntityComponent(entityA, colorFactory, color)
  .addEntityComponent(entityA, positionFactory, position)
  .addEntityComponent(entityA, velocityFactory, velocity)
  .addEntityComponent(entityB, colorFactory, color);

world.log();

for (const [_entity, components] of world.view(
  colorFactory,
  positionFactory,
  velocityFactory,
)) {
  console.log(components.color);
}
