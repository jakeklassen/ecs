import { describe, expect, expectTypeOf, it } from 'vitest';
import { SafeEntity, World } from './world.js';
import { Archetype } from './archetype.js';

type Entity = {
  color?: string;
  rectangle?: {
    width: number;
    height: number;
  };
  tagPlayer?: true;
  transform?: {
    position: {
      x: number;
      y: number;
    };
  };
  velocity?: {
    x: number;
    y: number;
  };
};

describe('Archetype', () => {
  describe('get entities()', () => {
    it('returns an entity iterator', () => {
      const world = new World<Entity>();
      const archetype = new Archetype({
        world,
        entities: new Set<Entity>(),
        components: ['color'],
      });

      world.createEntity({ color: 'red' });
      world.createEntity({ color: 'blue' });

      expect(archetype.entities).toBeInstanceOf(Object);
      expectTypeOf(archetype.entities).toEqualTypeOf<
        ReadonlySet<SafeEntity<Entity, 'color'>>
      >();
    });
  });

  describe('matches()', () => {
    it('should correctly check if an entity matches the archetype', () => {
      const world = new World<Entity>();
      const archetype = new Archetype({
        world,
        entities: new Set<Entity>(),
        components: ['color'],
      });

      const entity = world.createEntity({ color: 'red' });

      expect(archetype.matches(entity)).toBe(true);
    });

    it('should correctly check if an entity does not match the archetype', () => {
      const world = new World<Entity>();
      const archetype = new Archetype({
        world,
        entities: new Set<Entity>(),
        components: ['color'],
        without: ['tagPlayer'],
      });

      const entity = world.createEntity();
      const entity2 = world.createEntity({ color: 'red', tagPlayer: true });

      expect(archetype.matches(entity)).toBe(false);
      expect(archetype.matches(entity2)).toBe(false);
    });
  });

  describe('without()', () => {
    it('should correctly create a new archetype ignoring entities with components', () => {
      const world = new World<Entity>();

      const entity = world.createEntity({
        color: 'red',
        rectangle: { width: 10, height: 10 },
        transform: { position: { x: 0, y: 0 } },
        tagPlayer: true,
      });

      const entity2 = world.createEntity({
        color: 'blue',
        rectangle: { width: 10, height: 10 },
        transform: { position: { x: 0, y: 0 } },
      });

      const renderables = world.archetype('color', 'rectangle', 'transform');

      expect(world.archetypes.size).toBe(1);
      expect(renderables.entities.size).toBe(2);
      expect(renderables.entities.has(entity)).toBe(true);
      expect(renderables.entities.has(entity2)).toBe(true);

      const nonPlayerRenderables = renderables.without('tagPlayer');

      expect(world.archetypes.size).toBe(2);

      expectTypeOf(nonPlayerRenderables.entities).toEqualTypeOf<
        ReadonlySet<SafeEntity<Entity, 'color' | 'rectangle' | 'transform'>>
      >();
      expect(nonPlayerRenderables.entities.size).toBe(1);
      expect(nonPlayerRenderables.entities.has(entity)).toBe(false);
      expect(nonPlayerRenderables.entities.has(entity2)).toBe(true);

      world.addEntityComponents(entity2, 'tagPlayer', true);

      expect(renderables.entities.size).toBe(2);
      expect(nonPlayerRenderables.entities.size).toBe(0);
    });
  });
});
