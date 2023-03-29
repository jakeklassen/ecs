import { Archetype } from './archetype.js';
import { World } from './world.js';

// Playground link to the good times with `asserts`
// https://tsplay.dev/WG8z0w

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
  color?: string;
  direction?: Vector2d;
  muzzleFlash?: {
    duration: number;
    durationMs: number;
    initialSize: number;
    offset: Vector2d;
    size: number;
  };
  position?: Vector2d;
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
const world: World<Entity> = new World<Entity>();

world.createEntity().color = 'red';

const e = world.createEntity({
  color: 'red',
  position: { x: 0, y: 0 },
  velocity: { x: 1, y: 1 },
});

e.color = 'blue';

// @ts-expect-error - you should not be able to assign non-existent properties
e.nonExistentProperty = true;

const o = {} as const;
declare const _ok: keyof typeof o extends never ? true : false;
//             ^?

e.position.x += e.velocity.x;

world.addEntityComponents(e, 'color', 'blue');

e.color;
//  ^?

world.addEntityComponents(e, 'tagPlayer', true);

// @ts-expect-error - we didn't store the updated return type from addEntityComponents
e.tagPlayer;
//    ^?

const moving = world.archetype('position', 'velocity');

function physicsSystem(dt: number) {
  for (const entity of moving.entities) {
    entity.color?.toLocaleLowerCase();
    entity.position.x += entity.velocity.x * dt;
  }
}

physicsSystem(1 / 60);

world.createEntity({
  position: { x: 0, y: 0 },
  velocity: { x: 1, y: 1 },
});

console.log(world.entities);

const _arc = new Archetype({
  entities: new Set<Entity>(),
  world: new World<Entity>(),
  components: ['boxCollider', 'direction'],
  without: ['tagPlayer'],
});
const _arc2 = _arc.without('tagPlayer');

for (const entity of _arc.entities) {
  entity.boxCollider.height;
  entity.direction.x;

  entity.velocity?.x;
  entity.tagPlayer;
}

for (const entity of _arc2.entities) {
  entity.boxCollider;
  //        ^?
  entity.direction;
  //        ^?
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  entity.tagPlayer;
  //        ^?
}

// Bug to report?
// const narrow = <T extends Exact<Entity, T>>(entity: T) => entity;
// narrow({ color: 'red' }).color = 'blue';
