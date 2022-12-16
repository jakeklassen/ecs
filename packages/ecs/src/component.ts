export abstract class Component {
  /**
   * The purpose of this property is to somewhat support nominal typing.
   * TypeScript is structurally typed, so we add a protected readonly
   * property that can be inherited and will satisfy the Component shape.
   * This way, we can make some reasonably safe assumptions about the
   * type of a Component.
   *
   * @example
   * declare function doStuff(c: Component): void;
   *
   * // Try to simluate being a Component
   * class Foo {
   *   protected readonly __component = Foo.name;
   * }
   *
   * // Argument of type 'Foo' is not assignable to parameter of type 'Component'.
   * doStuff(new Foo()); // ❌
   *
   * class Health extends Component {
   *   accessor health = 100;
   * }
   *
   * doStuff(new Health()); // ✅
   */
  protected readonly __component = Component.name;
}
