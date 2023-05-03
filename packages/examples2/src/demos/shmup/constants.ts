/**
 * Pico-8 palette object
 */
export const Pico8Colors = {
  Color0: '#000000',
  Color1: '#1d2b53',
  Color2: '#7E2553',
  Color3: '#008751',
  Color4: '#ab5236',
  Color5: '#5F574F',
  Color6: '#c2c3c7',
  Color7: '#fff1e8',
  Color8: '#FF004D',
  Color9: '#FFA300',
  Color10: '#FFEC27',
  Color11: '#00e436',
  Color12: '#29adff',
  Color13: '#83769c',
  Color14: '#ff77a8',
  Color15: '#ffccaa',
} as const;

export const EnemyType = {
  GreenAlien: 'greenAlien',
  RedFlameGuy: 'redFlameGuy',
  SpinningShip: 'spinningShip',
  YellowShip: 'yellowShip',
  Boss: 'boss',
} as const;

export const SpriteLayer = {
  Background: -1,
  Base: 0,
  Entity: 1,
  Explosion: 2,
} as const;
