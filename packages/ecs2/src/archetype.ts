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

export class Archetype<
  Entity extends JsonObject,
  Components extends Array<keyof Entity>,
> {
  #entities: Set<Entity> = new Set();
  #world: World<Entity>;
  #components: Components;

  constructor(world: World<Entity>, ...components: Components) {
    this.#world = world;
    this.#components = components;

    for (const entity of this.#entities) {
      const matchesArchetype = components.every((component) => {
        return component in entity;
      });

      if (matchesArchetype === true) {
        this.#entities.add(entity);
      }
    }
  }

  public get entities(): Set<SafeEntity<Entity, Components[number]>> {
    return this.#entities;
  }

  public get components(): Readonly<Components> {
    return this.#components;
  }

  without<Without extends Array<Exclude<keyof Entity, Components[number]>>>(
    ...components: Without
  ): Archetype<
    SafeEntity<
      Omit<Entity, Without[number]>,
      Exclude<Components[number], (typeof components)[number]>
    >,
    Array<Exclude<Components[number], Without[number]>>
  > {
    return {} as any;
  }
}

const _arc = new Archetype(new World<Entity>(), 'boxCollider', 'direction');
const _arc2 = _arc.without('tagPlayer');

for (const entity of _arc.entities) {
  entity.boxCollider.height;
  entity.direction.x;

  entity.velocity?.x;
}

for (const entity of _arc2.entities) {
  entity.boxCollider;
  //        ^?
  entity.direction;
  //        ^?
  entity.tagPlayer;
  //        ^?
}
