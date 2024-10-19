import { describe, expect, it } from 'vitest';
import { ComponentMap } from './component-map.js';
import { Component } from './component.js';
import { World } from './world.js';

class Color extends Component {
  constructor(public value = 'black') {
    super();
  }
}

class Rectangle extends Component {
  constructor(
    public width = 0,
    public height = 0,
  ) {
    super();
  }
}

class Transform extends Component {
  constructor(public position = new Position()) {
    super();
  }
}

class Position extends Component {
  constructor(
    public x = 0,
    public y = 0,
  ) {
    super();
  }
}

describe('World', () => {
  describe('get entities()', () => {
    it('returns a readonly map of entites', () => {
      const world = new World();

      world.createEntity();
      world.createEntity();

      expect(world.entities).toBeInstanceOf(Map);

      for (const [entity, components] of world.entities) {
        expect(entity).toBeGreaterThan(0);
        expect(components).toBeInstanceOf(ComponentMap);
      }
    });
  });

  describe('createEntity()', () => {
    it('returns a new entity', () => {
      const world = new World();
      expect(world.createEntity()).toBeDefined();
    });

    it('can return a recycled entity', () => {
      const world = new World();
      const entity = world.createEntity();

      world.deleteEntity(entity);

      const entity2 = world.createEntity();

      expect(entity).toBe(entity2);
    });
  });

  describe('deleteEntity()', () => {
    it('should delete an entity and return true', () => {
      const world = new World();
      const entity = world.createEntity();

      expect(world.deleteEntity(entity)).toBe(true);
    });

    it('should not delete an entity and return false', () => {
      const world = new World();

      expect(world.deleteEntity(Number.MAX_SAFE_INTEGER)).toBe(false);
    });

    it('should return false if the entity has already been deleted', () => {
      const world = new World();
      const entity = world.createEntity();

      expect(world.deleteEntity(entity)).toBe(true);
      expect(world.deleteEntity(entity)).toBe(false);
    });
  });

  describe('addEntityComponents()', () => {
    it('should add components to entity component map', () => {
      const world = new World();
      const entity = world.createEntity();
      world.addEntityComponents(entity, new Color(), new Rectangle());

      const components = world.getEntityComponents(entity);

      expect(components?.has(Color, Rectangle)).toBe(true);
    });

    it('should return `World` instance for chaining', () => {
      const world = new World();
      const entity = world.createEntity();

      expect(world.addEntityComponents(entity, new Color())).toBeInstanceOf(
        World,
      );
    });

    it('should throw an error if entity has been deleted', () => {
      const world = new World();
      const entity = world.createEntity();
      world.deleteEntity(entity);

      expect(() =>
        world.addEntityComponents(entity, new Color()),
      ).toThrowError();
    });
  });

  describe('removeEntityComponents()', () => {
    it('should remove entity components', () => {
      const world = new World();
      const entity = world.createEntity();
      world.addEntityComponents(entity, new Color(), new Rectangle());

      let components = world.getEntityComponents(entity);

      expect(components?.has(Color, Rectangle)).toBe(true);

      world.removeEntityComponents(entity, Color);

      components = world.getEntityComponents(entity);

      expect(components?.has(Color)).toBe(false);
      expect(components?.has(Rectangle)).toBe(true);
    });

    it('should not error if entity does not have components', () => {
      const world = new World();
      const entity = world.createEntity();
      world.addEntityComponents(entity, new Color());

      expect(() =>
        world.removeEntityComponents(entity, Rectangle),
      ).not.toThrow();
    });

    it('should not throw if entity does not exist and is not deleted', () => {
      const world = new World();

      expect(() => world.removeEntityComponents(1, Color)).not.toThrowError();
    });

    it('should throw if entity has been mark for deletion', () => {
      const world = new World();
      const entity = world.createEntity();
      world.deleteEntity(entity);

      expect(() => world.removeEntityComponents(entity, Color)).toThrowError();
    });
  });

  describe('findEntity()', () => {
    it('should return the entity', () => {
      const world = new World();
      const entity = world.createEntity();
      world.addEntityComponents(entity, new Color());

      expect(world.findEntity(Color)).toBe(entity);
    });

    it('should return the first matching entity by insertion order', () => {
      const world = new World();
      const entity = world.createEntity();
      world.addEntityComponents(entity, new Color());

      expect(world.findEntity(Color)).toBe(entity);

      const entity2 = world.createEntity();
      world.addEntityComponents(entity2, new Color(), new Rectangle());

      expect(world.findEntity(Color, Rectangle)).toBe(entity2);

      const entity3 = world.createEntity();
      world.addEntityComponents(
        entity3,
        new Color(),
        new Rectangle(),
        new Transform(),
      );

      expect(world.findEntity(Color, Rectangle)).toBe(entity2);
      expect(world.findEntity(Color, Rectangle, Transform)).toBe(entity3);
    });

    it('should return undefined when not found', () => {
      const world = new World();
      const entity = world.createEntity();
      world.addEntityComponents(entity, new Rectangle());

      expect(world.findEntity(Color)).toBeUndefined();
    });

    it('should return undefined when no component constructors are passed', () => {
      const world = new World();
      const entity = world.createEntity();
      world.addEntityComponents(entity, new Rectangle());

      expect(world.findEntity()).toBeUndefined();
    });

    it('should not return a deleted entities', () => {
      const world = new World();
      const entity = world.createEntity();
      world.addEntityComponents(entity, new Color());

      const entity2 = world.createEntity();
      world.addEntityComponents(entity2, new Color(), new Rectangle());

      world.deleteEntity(entity);

      expect(world.findEntity(Color)).not.toBe(entity);
    });
  });

  describe('getEntityComponents()', () => {
    it('should return ComponentMap for existing entity', () => {
      const world = new World();
      const entity = world.createEntity();
      const components = world.getEntityComponents(entity);

      expect(components).toBeInstanceOf(ComponentMap);
    });

    it('should return undefined for non-existing entity', () => {
      const world = new World();

      expect(
        world.getEntityComponents(Number.MAX_SAFE_INTEGER),
      ).toBeUndefined();
    });

    it('should return undefined if entity has been deleted', () => {
      const world = new World();
      const entity = world.createEntity();
      world.deleteEntity(entity);

      expect(world.getEntityComponents(entity)).toBeUndefined();
    });
  });

  describe('view()', () => {
    it('should return the correct views', () => {
      const world = new World();
      const entityId = world.createEntity();
      const testPosition = new Position();

      world.addEntityComponents(entityId, testPosition);
      expect(world.view(Position)).toEqual([
        [entityId, world.getEntityComponents(entityId)],
      ]);

      expect(world.view(Position, Color)).toEqual([]);
    });
  });
});
