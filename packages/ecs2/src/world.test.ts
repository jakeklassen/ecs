import { describe, expect, expectTypeOf, it } from 'vitest';
import { World } from './world.js';

type Entity = {
  color?: string;
  rectangle?: {
    width: number;
    height: number;
  };
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

describe('World', () => {
  describe('get entities()', () => {
    it('returns an entity iterator', () => {
      const world = new World<Entity>();

      world.createEntity({ color: 'red' });
      world.createEntity({ color: 'blue' });

      expect(world.entities).toBeInstanceOf(Object);
      expectTypeOf(world.entities).toEqualTypeOf<Readonly<Set<Entity>>>();
    });
  });

  describe('createEntity()', () => {
    it('returns a new entity', () => {
      const world = new World<Entity>();

      const entityA = world.createEntity({ color: 'red' });

      expect(entityA).toBeDefined();
      expect(entityA.color).toBe('red');
    });

    it('should support initial empty entities as unique', () => {
      const world = new World<Entity>();

      const entityA = world.createEntity({});
      const entityB = world.createEntity({});

      expect(entityA).not.toBe(entityB);

      world.addEntityComponents(entityA, 'color', 'red');

      expect(entityA.color).toBe('red');
      expect(entityB.color).toBeUndefined();
      expect(entityA).not.toBe(entityB);
    });
  });

  describe('deleteEntity()', () => {
    it('should delete an entity and return true', () => {
      const world = new World<Entity>();

      const entity = world.createEntity({});

      expect(world.deleteEntity(entity)).toBe(true);
    });

    it('should not delete an entity and return false', () => {
      const world = new World<Entity>();

      expect(world.deleteEntity({})).toBe(false);
    });

    it('should return false if the entity has already been deleted', () => {
      const world = new World<Entity>();
      const entity = world.createEntity({});

      expect(world.deleteEntity(entity)).toBe(true);
      expect(world.deleteEntity(entity)).toBe(false);
    });
  });

  describe('addEntityComponents()', () => {
    it('should add components to entity', () => {
      const world = new World<Entity>();
      const entity = world.createEntity();
      world.addEntityComponents(entity, 'color', 'red');
      world.addEntityComponents(entity, 'rectangle', { width: 10, height: 10 });

      expect(entity.color).toBe('red');
      expect(entity.rectangle).toEqual({ width: 10, height: 10 });
    });

    it('should return `World` instance for chaining', () => {
      const world = new World<Entity>();
      const entity = world.createEntity();

      expect(world.addEntityComponents(entity, 'color', 'red')).toBeInstanceOf(
        World,
      );
    });
  });

  describe('removeEntityComponents()', () => {
    it('should remove entity components', () => {
      const world = new World<Entity>();
      const entity = world.createEntity();
      world.addEntityComponents(entity, 'color', 'red');
      world.addEntityComponents(entity, 'rectangle', { width: 10, height: 10 });

      world.removeEntityComponents(entity, 'color');

      expect(entity.color).toBeUndefined();
      expect(entity.rectangle).toEqual({ width: 10, height: 10 });
    });

    it('should not error if entity does not have components', () => {
      const world = new World<Entity>();
      const entity = world.createEntity();
      world.addEntityComponents(entity, 'color', 'red');

      expect(() =>
        world.removeEntityComponents(entity, 'rectangle'),
      ).not.toThrow();
    });

    it('should not throw if entity does not exist and is not deleted', () => {
      const world = new World<Entity>();

      expect(() =>
        world.removeEntityComponents({}, 'color'),
      ).not.toThrowError();
    });

    it.skip('should throw if entity has been mark for deletion');
  });

  describe('archetype()', () => {
    it('should return the correct archetype', () => {
      const world = new World<Entity>();
      const entity = world.createEntity();
      const testTransform = { position: { x: 0, y: 0 } };

      world.addEntityComponents(entity, 'transform', testTransform);
      expect(world.archetype('transform')).toEqual({
        entities: new Set([entity]),
      });

      expect(world.archetype('color')).toEqual({ entities: new Set() });
    });

    it('should be updated correctly via removeEntityComponents()', () => {
      const world = new World<Entity>();
      const entity = world.createEntity();
      const moving = world.archetype('transform', 'velocity');

      expect(moving).toEqual({ entities: new Set() });

      world.addEntityComponents(entity, 'transform', {
        position: { x: 0, y: 0 },
      });
      world.addEntityComponents(entity, 'velocity', { x: 10, y: 10 });

      expect(moving).toEqual({ entities: new Set([entity]) });

      world.removeEntityComponents(entity, 'transform');

      expect(moving).toEqual({ entities: new Set() });
    });
  });
});
