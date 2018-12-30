/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import 'sass/index.scss';
import io from 'socket.io-client';
import reducer from 'reducers';
import SocketClient from 'lib/SocketClient';
import App from 'components/App';

const composeEnhancers = (
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-underscore-dangle
  || compose
);

// Initialize the network socket.
const roomName = 'pixiedev';
const socket = io('http://localhost:4000', {
  autoConnect: false,
  query: `roomName=${roomName}`,
});
SocketClient.init(socket);

const store = createStore(reducer, undefined, composeEnhancers());

window.onload = () => {
  ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'));
};
