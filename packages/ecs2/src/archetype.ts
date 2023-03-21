import { JsonObject } from 'type-fest';
import { World } from './world.js';

type AnimationDetails = {
  name: string;
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
  frameWidth: number;
  frameHeight: number;
};

export type Frame = {
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
};

type Sprite = {
  frame: Frame;
  opacity: number;
};

type SpriteAnimation = {
  delta: number;
  durationMs: number;
  frameRate: number;
  currentFrame: number;
  finished: boolean;
  loop: boolean;
  frames: Frame[];
  frameSequence: number[];
  animationDetails: AnimationDetails;
};

type Vector2d = {
  x: number;
  y: number;
};

type Transform = {
  position: Vector2d;
  scale: Vector2d;
  rotation: number;
};

type BoxCollider = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export type Entity = {
  boxCollider?: BoxCollider;
  direction?: Vector2d;
  muzzleFlash?: {
    duration: number;
    durationMs: number;
    initialSize: number;
    offset: Vector2d;
    size: number;
  };
  sprite?: Sprite;
  spriteAnimation?: SpriteAnimation;
  tagBullet?: true;
  tagPlayer?: true;
  trackPlayer?: {
    offset?: Vector2d;
  };
  transform?: Transform;
  velocity?: Vector2d;
};

type SafeEntity<
  Entity extends JsonObject,
  Components extends keyof Entity,
> = Entity & Required<Pick<Entity, Components>>;

export class Archetype<Entity extends JsonObject> {
  #entities: Set<Entity> = new Set();
  #world: World<Entity>;

  constructor(world: World<Entity>) {
    this.#world = world;
  }

  public get entities(): Readonly<Set<Entity>> {
    return this.#entities;
  }

  with<Components extends Array<keyof Entity>>(
    ...components: Components
  ): Archetype<SafeEntity<Entity, (typeof components)[number]>> & {
    without<
      Without extends Array<Exclude<keyof Entity, (typeof components)[number]>>,
    >(
      ...components: Without
    ): Archetype<SafeEntity<Entity, (typeof components)[number]>>;
  } {
    return {} as any;
  }

  // without<const Without extends Array<keyof Entity>>(
  //   ...components: Without
  // ): Archetype<SafeEntity<Entity, (typeof components)[number]>> {
  //   return {} as any;
  // }
}

const _arc = new Archetype<Entity>(new World<Entity>())
  .with('boxCollider')
  .without('direction');

// .without('boxCollider');

// for (const entity of a.entities) {
//   entity.boxCollider.height;
// }
