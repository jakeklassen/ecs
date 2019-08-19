import { Component } from './component';
import { ComponentMap } from './component-map';
import { Entity } from './entity';
import { World } from './world';

// tslint:disable: max-classes-per-file

class Color extends Component {}
class Rectangle extends Component {}
class Transform extends Component {}

describe('World', () => {
  describe('createEntity()', () => {
    it('returns a new entity', () => {
      const world = new World();
      expect(world.createEntity().id).toBeDefined();
    });
  });

  describe('addEntityComponents()', () => {
    it('should add components to entity component map', () => {
      const world = new World();
      const entity = world.createEntity();
      world.addEntityComponents(entity, new Color(), new Rectangle());

      const components = world.getEntityComponents(entity)!;
      expect(
        components.bitmask.isEqual(Color.bitmask.or(Rectangle.bitmask)),
      ).toBe(true);
    });

    it('should return `World` instance for chaining', () => {
      const world = new World();
      const entity = world.createEntity();

      expect(world.addEntityComponents(entity, new Color())).toBeInstanceOf(
        World,
      );
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

      expect(world.getEntityComponents({} as Entity)).toBeUndefined();
    });
  });
});
