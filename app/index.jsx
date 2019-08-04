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
import io from 'socket.io-client';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { electronEnhancer } from 'redux-electron-store';
import Cache from './lib/Cache';
import reducer from './reducers';
import sagas from './sagas';
import SocketClient from './lib/SocketClient';
import App from './components/App';
import { updateSettings } from './mutations/settings';

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
const store = createStore(
  reducer,
  compose(
    applyMiddleware(sagaMiddleware),
    electronEnhancer({
      dispatchProxy: a => store.dispatch(a),
    }),
    composeEnhancers(),
  ),
);
sagaMiddleware.run(sagas);

const {
  user: {
    firstName,
  },
  view: {
    isMicEnabled,
  },
} = store.getState();

// WebSockets
// Initialize the network socket.
const roomName = 'pixiedev';
const host = 'https://pixiehd.neetos.com';
// const host = 'http://localhost:4000';

const socket = io(host, {
  autoConnect: true,
  query: `roomName=${roomName}&firstName=${firstName}&isMicEnabled=${isMicEnabled}`,
});

SocketClient.init(socket, store);

// GraphQL
const apolloClient = new ApolloClient({
  uri: host,
  cache: Cache,
  clientState: {
    defaults: {
      videoEnabled: true,
      micEnabled: true,
    },
    resolvers: {
      Mutation: {
        updateSettings,
      },
    },
  },
});

window.onload = () => {
  render(
    <ApolloProvider client={apolloClient}>
      <ApolloHooksProvider client={apolloClient}>
        <IntlProvider {...i18n}>
          <Provider store={store}>
            <App />
          </Provider>
        </IntlProvider>
      </ApolloHooksProvider>
    </ApolloProvider>,
    document.getElementById('app'),
  );
};
