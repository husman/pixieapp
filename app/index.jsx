/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import './sass/index.scss';
import io from 'socket.io-client';
import reducer from './reducers';
import SocketClient from './lib/SocketClient';
import App from './components/App';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Initialize the network socket.
const roomName = 'pixiedev';
const host = 'https://pixiehd.neetos.com';
// const host = 'http://localhost:4000';

const socket = io(host, {
  autoConnect: false,
  query: `roomName=${roomName}`,
});
SocketClient.init(socket);

const store = createStore(reducer, undefined, composeEnhancers());

window.onload = () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app'),
  );
};
