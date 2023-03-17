type KeyOptions = {
  triggerOnce?: boolean;
  toggle?: boolean;
};

/**
 * Represents an input event, bound to a key, which trigger once support.
 * @param key Should be a valid KeyboardEvent.code
 * @param triggerOnce
 * @returns
 */
const Key = (
  key: string,
  { triggerOnce = false, toggle = false }: KeyOptions = {},
) => {
  let keyDown = false;
  let hasBeenRead = false;

  window.document.addEventListener('keydown', (e: KeyboardEvent) => {
    switch (e.code) {
      case key: {
        if (toggle) {
          return;
        }

        keyDown = true;
      }
    }
  });

  window.document.addEventListener('keyup', (e: KeyboardEvent) => {
    switch (e.code) {
      case key:
        if (toggle) {
          keyDown = !keyDown;

          return;
        }

        hasBeenRead = false;
        keyDown = false;
    }
  });

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
  };
};

export const input = {
  debug: Key('KeyD', { toggle: true }),
  left: Key('ArrowLeft'),
  right: Key('ArrowRight'),
  up: Key('ArrowUp'),
  down: Key('ArrowDown'),
  shoot: Key('KeyZ'),
  confirm: Key('KeyX', { triggerOnce: true }),
};

export type Input = typeof input;
