/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

class SocketClient {
  socket = null;

  /**
   * Initializes the socket reference.
   *
   * @param {{}} socket - The socket reference.
   */
  init(socket) {
    if (!socket) {
      return;
    }

    this.socket = socket;
  }

  /**
   * Listens to an event on the socket.
   *
   * @param {String} event - The event type label.
   * @param handler - The callback to execute when the event dispatches.
   */
  on(event, handler) {
    const {
      socket,
    } = this;

    if (!socket) {
      return;
    }

    socket.on(event, handler);
  }

  /**
   * Emits an event with the specified arguments on the socket.
   *
   * @param {String} event - The event type label.
   * @param {*} args - The arguments to emit the event with.
   */
  emit(event, ...args) {
    const {
      socket,
    } = this;

    if (!socket) {
      return;
    }

    socket.emit(event, ...args);
  }

  /**
   * Returns the current client's socket ID.
   *
   * @returns {String} - The client's socket ID.
   */
  getClientId() {
    const {
      socket,
    } = this;

    return socket ? socket.id : '';
  }

  /**
   * Connects to the server.
   */
  connect() {
    const {
      socket,
    } = this;

    if (!socket) {
      return;
    }

    socket.open();
  }
}

export default new SocketClient();
