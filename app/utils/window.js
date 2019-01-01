/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

/**
 * Abstraction for the window.
 */
class Win {
  /**
   * Initializes the window reference.
   */
  constructor() {
    this.win = window || null;
  }

  /**
   * Binds a handler to a window event.
   *
   * @param {String} eventType
   * @param {Function} handler
   */
  on(eventType, handler) {
    const {
      win,
    } = this;

    if (win) {
      win.addEventListener(eventType, handler);
    }
  }

  /**
   * Throttles a window event.
   * See: https://developer.mozilla.org/en-US/docs/Web/Events/resize#Examples
   *
   * @param {String} eventType - The event type.
   * @param {String} alias - The event label for the resulting 'optimized' event.
   */
  throttleEvent(eventType, alias) {
    const {
      win,
    } = this;
    let running = false;

    /**
     * Handler for event throttles.
     */
    const onThrottle = () => {
      if (running) {
        return;
      }

      running = true;
      requestAnimationFrame(() => {
        win.dispatchEvent(new CustomEvent(alias));
        running = false;
      });
    };

    win.addEventListener(eventType, onThrottle);

    return onThrottle;
  }

  /**
   * Returns the size of the primary window.
   *
   * @returns {Electron.Size|{}} - Returns the size of the primary window on success.
   */
  getPrimaryWindowSize() {
    let size = {};

    if (this.win) {
      size = {
        width: this.win.innerWidth,
        height: this.win.innerHeight,
      };
    }

    return size;
  }
}

export default new Win();
