export function gameOverRenderingSystemFactory({
  context,
  imageData,
}: {
  context: CanvasRenderingContext2D;
  imageData: ImageData;
}) {
  return function gameOverRenderingSystem() {
    context.putImageData(imageData, 0, 0);
  };
}
