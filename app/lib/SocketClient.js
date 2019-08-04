import {
  CHAT_PEER_EVENT_MESSAGE,
  PEER_EVENT_USER_JOINED,
  PEER_EVENT_USER_LEFT,
} from '../constants/chat';
import { remoteChatMessageReceived } from '../actions/chat';
import {
  userJoined,
  userLeft,
} from '../actions/user';

/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

class SocketClient {
  socket = null;

  init(socket, store) {
    if (!socket) {
      return;
    }

    this.socket = socket;
    this.store = store;

    this.on(CHAT_PEER_EVENT_MESSAGE, (clientId, data) => {
      store.dispatch(remoteChatMessageReceived(clientId, data));
    });

    this.on(PEER_EVENT_USER_JOINED, (clientId, data) => {
      store.dispatch(userJoined(clientId, data));
    });

    this.on(PEER_EVENT_USER_LEFT, (clientId) => {
      const {
        view: {
          users,
        },
      } = store.getState();
      const user = users.find(({ id }) => id === clientId) || {};

      store.dispatch(userLeft(clientId, user));
    });
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
