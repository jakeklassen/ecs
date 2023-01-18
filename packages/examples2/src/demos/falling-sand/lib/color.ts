// class Color {
//   #mode = 'rgb' as const;
//   #maxes = {
//     rgb: [255, 255, 255, 1],
//   };

//   constructor(r = 0, g = 0, b = 0, a = 1) {}

//   private parseInput(r = 0, g = 0, b = 0, a = 1) {
//     const mode = this.#mode;
//     const maxes = this.#maxes[mode];
//     let results: number[] = [];
//   }
// }

import Color from 'color';
import randomInteger from 'just-random-integer';

export const varyColor = (colorString: string) => {
  const color = Color(colorString);
  const hue = color.hue();
  const saturation = color.saturationl() + randomInteger(-20, 0);
  const lightness = color.lightness() + randomInteger(-10, 10);

  return color.hsl(hue, saturation, lightness);
};

// export function varyColor(p, color) {

//   let hue = p.floor(p.hue(color));
//   let saturation = p.saturation(color) + p.floor(p.random(-20, 0));
//   saturation = p.constrain(saturation, 0, 100);
//   let lightness = p.lightness(color) + p.floor(p.random(-10, 10));
//   lightness = p.constrain(lightness, 0, 100);
//   return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
// }
