import Color from 'color';
import randomInteger from 'just-random-integer';

export const varyColor = (colorString: string) => {
  const color = Color(colorString);
  const hue = color.hue();
  const saturation = color.saturationl() + randomInteger(-20, 0);
  const lightness = color.lightness() + randomInteger(-10, 10);

  return color.hsl(hue, saturation, lightness);
};
