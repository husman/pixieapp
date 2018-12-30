/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

class SocketClient {
  _socket = null;

  /**
   * Initializes the socket reference.
   *
   * @param {{}} socket - The socket reference.
   */
  init(socket) {
    if (!socket) {
      return;
    }

    this._socket = socket;
  }

  /**
   * Listens to an event on the socket.
   *
   * @param {String} event - The event type label.
   * @param handler - The callback to execute when the event dispatches.
   */
  on(event, handler) {
    const {
      _socket,
    } = this;

    if (!_socket) {
      return;
    }

    _socket.on(event, handler);
  }

  /**
   * Emits an event with the specified arguments on the socket.
   *
   * @param {String} event - The event type label.
   * @param {Array} args - The arguments to emit the event with.
   */
  emit(event, ...args) {
    const {
      _socket,
    } = this;

    if (!_socket) {
      return;
    }

    _socket.emit(event, ...args);
  }

  /**
   * Returns the current client's socket ID.
   *
   * @returns {String|undefined} - The client's socket ID.
   */
  getClientId() {
    const {
      _socket,
    } = this;

    if (!_socket) {
      return;
    }

    return _socket.id;
  }

  /**
   * Connects to the server.
   */
  connect() {
    const {
      _socket,
    } = this;

    if (!_socket) {
      return;
    }

    _socket.open();
  }
}

export default new SocketClient();
