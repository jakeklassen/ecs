import { Gamepad, Keyboard, or } from 'gameinput';

export const keyboard = new Keyboard();
export const gamepad = new Gamepad();

export const controls = {
  any: or(gamepad.button('*').trigger, keyboard.key('any').trigger),
  left: or(gamepad.button('Left'), keyboard.key('ArrowLeft')),
  right: or(gamepad.button('Right'), keyboard.key('ArrowRight')),
  up: or(gamepad.button('Up'), keyboard.key('ArrowUp')),
  down: or(gamepad.button('Down'), keyboard.key('ArrowDown')),
  fire: or(gamepad.button('A'), keyboard.key('Z')),
  bomb: or(gamepad.button('X'), keyboard.key('B')),
  debug: or(gamepad.button('RB').trigger, keyboard.key('D').trigger),
  confirm: or(gamepad.button('B').trigger, keyboard.key('X').trigger),
  quit: or(gamepad.button('Start').trigger, keyboard.key('Escape').trigger),
  win: or(gamepad.button('Back').trigger, keyboard.key('W').trigger),
};

export type Controls = typeof controls;
