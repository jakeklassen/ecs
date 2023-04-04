export function gameOverSystemFactory({
  context,
  imageData,
}: {
  context: CanvasRenderingContext2D;
  imageData: ImageData;
}) {
  return (_dt: number) => {
    context.putImageData(imageData, 0, 0);
  };
}
