import { Color } from '#/shared/components/color';
import { Position } from '#/shared/components/position';
import { Rectangle } from '#/shared/components/rectangle';
import { System, World } from '@jakeklassen/ecs';
import { canvas } from './main';

// Rendering system
export class RenderingSystem extends System {
  constructor(private readonly context: CanvasRenderingContext2D) {
    super();
  }

  public update(world: World, _dt: number): void {
    this.context.clearRect(0, 0, canvas.width, canvas.height);

    for (const [, componentMap] of world.view(Position, Color, Rectangle)) {
      const { color } = componentMap.get(Color);
      const { width, height } = componentMap.get(Rectangle);
      const { x, y } = componentMap.get(Position);

      this.context.fillStyle = color;
      this.context.fillRect(x, y, width, height);
    }
  }
}
