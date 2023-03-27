export const rndFromList = <T>(list: T[]): T =>
  list[Math.floor(Math.random() * list.length)];
