export const rnd = (max: number, min = 0) => Math.random() * (max - min) + min;

export const rndInt = (max: number, min = 0) => Math.floor(rnd(max, min));

export const deg2rad = (deg: number) => (deg * Math.PI) / 180;
