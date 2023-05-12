type KeyOptions = {
  triggerOnce?: boolean;
  toggle?: boolean;
};

/**
 * Represents an input event, bound to a key, with trigger once support.
 * @param key Should be a valid KeyboardEvent.code
 * @returns
 */
const keyboardKey = (
  key: 'any' | (string & {}),
  { triggerOnce = false, toggle = false }: KeyOptions = {},
) => {
  let keyDown = false;
  let hasBeenRead = false;

  function keyDownHandler(e: KeyboardEvent) {
    if (key === 'any') {
      if (toggle) {
        return;
      }

      keyDown = true;
    } else {
      switch (e.code) {
        case key: {
          if (toggle) {
            return;
          }

          keyDown = true;
        }
      }
    }
  }

  window.document.addEventListener('keydown', keyDownHandler);

  function keyUpHandler(e: KeyboardEvent) {
    if (key === 'any') {
      if (toggle) {
        keyDown = !keyDown;

        return;
      }

      hasBeenRead = false;
      keyDown = false;
    } else {
      switch (e.code) {
        case key:
          if (toggle) {
            keyDown = !keyDown;

            return;
          }

          hasBeenRead = false;
          keyDown = false;
      }
    }
  }

  window.document.addEventListener('keyup', keyUpHandler);

  return {
    query() {
      if (triggerOnce && keyDown) {
        if (hasBeenRead) {
          return false;
        }

        hasBeenRead = true;
        return keyDown;
      }

      return keyDown;
    },
    destroy() {
      window.document.removeEventListener('keydown', keyDownHandler);
      window.document.removeEventListener('keyup', keyUpHandler);
    },
  };
};

const any = keyboardKey('any', { triggerOnce: true });
const left = keyboardKey('ArrowLeft');
const right = keyboardKey('ArrowRight');
const up = keyboardKey('ArrowUp');
const down = keyboardKey('ArrowDown');
const fire = keyboardKey('KeyZ');
const bomb = keyboardKey('KeyB');
const debug = keyboardKey('KeyD', { triggerOnce: true });
const confirm = keyboardKey('KeyX', { triggerOnce: true });
const quit = keyboardKey('Escape', { triggerOnce: true });
const win = keyboardKey('KeyW', { triggerOnce: true });

export const input = {
  any,
  left,
  right,
  up,
  down,
  fire,
  bomb,
  debug,
  confirm,
  quit,
  win,
};

export type Input = typeof input;
