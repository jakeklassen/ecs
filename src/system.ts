import { World } from './world';

/**
 * Class for all Systems to derive from
 */
export abstract class System {
  /**
   *
   * @param world World
   * @param dt Delta time
   */
  public abstract update(world: World, dt: number): void;
}
