export function renderingSystemFactory({
  buffer,
  camera,
  context,
}: {
  buffer: HTMLCanvasElement;
  camera: { x: number; y: number };
  context: CanvasRenderingContext2D;
}) {
  return function renderingSystem() {
    context.translate(camera.x, camera.y);

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
    // Holy shit this is cool
    // context.filter = 'contrast(1.4) sepia(1) blur(1px)';

    context.drawImage(buffer, 0, 0);

    context.resetTransform();
  };
}
