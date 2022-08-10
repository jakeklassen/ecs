export const obtainCanvasAndContext2d = (id?: string) => {
  const canvas = document.querySelector<HTMLCanvasElement>(id ?? 'canvas');

  if (canvas == null) {
    throw new Error('failed to obtain canvas element');
  }

  const context = canvas.getContext('2d');

  if (context == null) {
    throw new Error('failed to obtain canvas 2d context');
  }

  return {
    canvas,
    context,
  };
};
