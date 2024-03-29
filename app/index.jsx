/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { render } from 'react-dom';
import {
  addLocaleData,
  IntlProvider,
} from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import './sass/index.scss';
import { ipcRenderer } from 'electron';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import reducer from './reducers';
import sagas from './sagas';
import SocketClient from './lib/SocketClient';
import App from './components/App';
import {
  appUpdateAvailable,
  appUpdateDownloaded,
} from './actions/app';
import {
  setStore as setWebrtcStore,
} from './lib/WebRtcSession';

// Localization
const localeData = require('react-intl/locale-data/ja');

addLocaleData(localeData);

const messages = {
  en: null,
  ja: {
    'button.mode.canvas': 'キャンバス',
    'button.mode.video': 'ビデオ',
    'button.mode.notebook': 'ノート',
    'button.myProfile': '私のプロフィール',
    'panel.tab.chat.label': 'チャット',
    'panel.tab.participants.label': '参加者',
    'chat.textfield.placeholder.text': 'メッセージを書く...',
    'participants.meeting.url.label': '会議のURL',
    'button.invite': '招待する',
    'chat.notice.userJoined': '{user}が会議に参加しました。',
    'chat.notice.userLeft': '{user}は会議を退席しました。',
  },
  es: {
    'button.mode.canvas': 'Lona',
    'button.mode.video': 'Vídeo',
    'button.mode.notebook': 'Cuaderno',
    'button.myProfile': 'Mi perfil',
    'panel.tab.chat.label': 'Charla',
    'panel.tab.participants.label': 'Participantes',
    'chat.textfield.placeholder.text': 'Escribe un mensaje...',
    'participants.meeting.url.label': 'La URL de su reunión',
    'button.invite': 'Invitación',
    'chat.notice.userJoined': '{user} se unió a la reunión.',
    'chat.notice.userLeft': '{user} abandonó la reunión.',
  },
};

const i18n = {
  locale: process.env.LANGUAGE || 'en',
  messages: messages[process.env.LANGUAGE],
};

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Redux
const sagaMiddleware = createSagaMiddleware();
const initialState = getInitialStateRenderer();

const store = createStore(
  reducer,
  initialState,
  compose(
    applyMiddleware(
      forwardToMain, // IMPORTANT! This goes first
      sagaMiddleware,
    ),
    composeEnhancers(),
  ),
);

replayActionRenderer(store);

sagaMiddleware.run(sagas);

// WebSockets
// // Initialize the network socket.
// const roomName = 'pixiedev';
// // const host = 'https://pixiehd.neetos.com';
// const host = 'http://localhost:4000';
//
// const socket = io(host, {
//   autoConnect: false,
//   query: `roomName=${roomName}&firstName=${firstName}&isMicEnabled=${isMicEnabled}`,
// });
//
SocketClient.setStore(store);
setWebrtcStore(store);


ipcRenderer.on('app-update-available', () => {
  store.dispatch(appUpdateAvailable());
});
ipcRenderer.on('update-downloaded', () => store.dispatch(appUpdateDownloaded()));

window.onload = () => {
  render(
    <IntlProvider {...i18n}>
      <Provider store={store}>
        <App />
      </Provider>
    </IntlProvider>,
    document.getElementById('app'),
  );
};
