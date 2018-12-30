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
    this._win = window ? window : null;
  }

  /**
   * Binds a handler to a window event.
   *
   * @param {String} eventType
   * @param {Function} handler
   */
  on(eventType, handler) {
    if (this._win) {
      this._win.addEventListener(eventType, handler);
    }
  }

  /**
   * unbinds a handler from a window event.
   *
   * @param {String} eventType
   * @param {Function} handler
   */
  off(eventType, handler) {
    if (this._win) {
      this._win.removeEventListener(eventType, handler);
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
        this._win.dispatchEvent(new CustomEvent(alias));
        running = false;
      });
    };

    this._win.addEventListener(eventType, onThrottle);

    return onThrottle;
  };

  /**
   * Remove event type throttle.
   *
   * @param {String} eventType - The event type.
   * @param {Function} throttleHandler - The event handler received when applying the throttled.
   */
  unthrottleEvent(eventType, throttleHandler) {
    if (throttleHandler) {
      this._win.removeEventListener(eventType, throttleHandler);
    }
  };

  /**
   * Returns the size of the primary window.
   *
   * @returns {Electron.Size|{}} - Returns the size of the primary window on success.
   */
  getPrimaryWindowSize() {
    let size = {};

    if (this._win) {
      size = {
        width: this._win.innerWidth,
        height: this._win.innerHeight,
      };
    }

    return size;
  }

  /**
   * Returns the computed CSS styles for the specified element.
   *
   * @param {{}} elem - The DOM element to compute the styles for.
   *
   * @returns {{}} - The computed styles or an empty object.
   */
  getComputedStyle(elem) {
    if (!this._win || !elem) {
      return {};
    }

    return this._win.getComputedStyle(elem);
  }

  /**
   * Returns the bounding rectangle for the specified element.
   *
   * @param {HTMLElement} elem - The element to fetch the bounding rectangle for.
   *
   * @returns {{}} - Returns the bounding rectangle for the specified elment.
   */
  getElementBoundingRect(elem) {
    let size = {};

    if (this._win && elem) {
      size = this._win.getBoundingClientRect(elem);
    }

    return size;
  }
}

export default new Win();
