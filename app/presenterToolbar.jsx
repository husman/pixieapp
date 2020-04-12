/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { forwardToMain, getInitialStateRenderer, replayActionRenderer } from 'electron-redux';
import './sass/presenter_toolbar.scss';
import PresenterToolbar from './components/PresenterToolbar';
import reducer from './reducers';
import sagas from './sagas';

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

window.onload = () => {
  render(
    <Provider store={store}>
      <PresenterToolbar />
    </Provider>,
    document.getElementById('presenter-toolbar'),
  );
};
